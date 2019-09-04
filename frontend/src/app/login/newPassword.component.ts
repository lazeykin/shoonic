import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {AlertService, ModalService} from '../_services';
import { AuthenticationService, UserService } from '../_services/index';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CustomValidator} from '../_services/custom_validators';

@Component({
    templateUrl: 'newPassword.component.html',
    styleUrls: ['newPassword.component.css']
})

export class NewPassword implements OnInit {
    @ViewChild('f') public form: NgForm;
    model: any = {
        password: '',
        password_confirm: '',
        token: ''
    };
    userData: any = {};
    showPass = false;
    loading = false;
    form_group = new FormGroup({
        password: new FormControl('', [<any> Validators.required, <any> Validators.minLength(6)]),
        password_confirm: new FormControl('', [<any> Validators.required, <any> Validators.minLength(6)]),
        token: new FormControl(this.router.url.replace("/core/confirm-password-reset/",''))
    }, CustomValidator.matchPassword);

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private userService: UserService,
        private modalService: ModalService,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.form_group.valueChanges.subscribe(value => {
            this.model = Object.assign({}, value)
        });
        // get return url from route parameters or default to '/'
        let returnUrl = this.router.url;
        this.model.token = returnUrl.replace("/core/confirm-password-reset/",'');
    }

    showPassword() {
        this.showPass = !this.showPass;
    }

    restorePassword() {
        this.loading = true;
        this.userService.restorePass(this.model)
            .subscribe(
                data => {
                    this.modalService.open("custom-modal-2");
                    this.userData = data;
                },
                error => {
                    this.alertService.errorRegistration(error, this.form_group);
                });
    }

    closeModal(id: string){
        this.modalService.close(id);
        this.authenticationService.login(this.userData.user.email, this.model.password)
            .subscribe(
                data => {
                    this.userService.saveCurrentUser(data)
                    if (data.scope[0] === "seller") {
                        this.router.navigate(['/dashboard/seller']);
                    } else if (data.scope[0] === 'fill_company_info') {
                        this.router.navigate(['/register/register-step-two']);
                    } else if (data.scope[0] === 'upload_invoice') {
                        this.router.navigate(['/register/register-step-four']);
                    } else if (data.scope[0] === 'confirm_email') {
                        this.modalService.open("custom-modal-1");
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
                    this.alertService.errorRegistration(error, this.form);
                });
    }
        
}
