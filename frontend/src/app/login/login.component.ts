import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ModalService } from '../_services';
import { AlertService, UserService, AuthenticationService } from '../_services/index';
import {NgForm} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    model: any = {};
    showPass = false;
    loading = false;
    loadingSub = false;
    returnUrl: string;
    emailSubscribe: string;
    isLoading: boolean = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        private modalService: ModalService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {}


    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        this.document.body.classList.add('loginBody');

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.isLoading = true;
        $('input#email, input#inputPassword').attr("disabled", "disabled");
        if (this.model.remember) {
            this.authenticationService.setRememberStatus(true);
        }
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    this.userService.saveCurrentUser(data);
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.removeItem('visitor');
                    }
                    if (data.scope[0] === "seller") {
                        this.router.navigate(['/dashboard/seller']);
                    } else if (data.scope[0] === 'fill_company_info') {
                        this.router.navigate(['/register/register-step-two']);
                    } else if (data.scope[0] === 'upload_invoice') {
                        this.router.navigate(['/register/register-step-four']);
                    } else if (data.scope[0] === 'confirm_email') {
                        this.modalService.open("custom-modal-2");
                        this.userService.resend(data.token)
                            .subscribe(
                                res => {
                                    console.log(res);
                                },
                                error => {
                                    this.alertService.errorRegistration(error, this.form);
                                });
                    } else {
                        this.router.navigate(['/dashboard/buyer']);
                    }
                },
                error => {
                    $('input#email, input#inputPassword').removeAttr("disabled");
                    this.alertService.errorRegistration(error, this.form);
                    this.isLoading = false;
                });
    }

    closeModal(id: string){
        this.modalService.close(id);
        this.router.navigate(['/']);
    }

    showPassword() {
        this.showPass = !this.showPass;
    }

}
