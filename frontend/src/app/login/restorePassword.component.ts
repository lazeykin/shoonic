import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, ModalService} from '../_services';
import { AuthenticationService, UserService } from '../_services/index';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {FormService} from '../_services/form';

@Component({
    templateUrl: 'restorePassword.component.html',
    styleUrls: ['restorePassword.component.css']
})

export class RestorePassword implements OnInit {
    form_group = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    })
    model: any = {};
    showError = false;
    returnUrl: string;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private modalService: ModalService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService) { }

    closeModal(id: string){
        this.modalService.close(id);
        this.router.navigate(['/']);
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        this.document.body.classList.add('loginBody');

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.form_group.valueChanges.subscribe(value => {
            this.model = Object.assign({}, value)
        })
    }

    restore() {
        if (!this.form_group.valid){
            new FormService().markTouched(this.form_group)
            console.log('invalid');
            return;
        }
        this.userService.restore(this.model.email)
            .subscribe(
                data => {
                    this.modalService.open("custom-modal-2");
                },
                error => {
                    this.alertService.errorRegistration(error, this.form_group);
                });
    }
        
}
