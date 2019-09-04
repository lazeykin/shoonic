import { ModalService } from './../_services/modal.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, UserService } from '../_services/index';
import {FormControl, FormGroup, MaxLengthValidator, NgForm, Validators} from '@angular/forms';
import {CustomValidator} from '../_services/custom_validators';
import {FormService} from '../_services/form';

@Component({
    templateUrl: 'registerStepOne.component.html',
    styleUrls: ['../_directives/header.component.css', './registerStepOne.component.css']
})

export class RegisterStepOne implements OnInit {
    modelName:any;
    isTermsOpened: boolean = false;
    model: any = {
        terms: false,
        email: "",
        first_name: "",
        last_name: "",
        reg_type: "",
        password: "",
        password_confirm: ""
    }
    isLoading: boolean = false;
    loading = false;
    show = false;
    data: any = {
        token: "",
    }

    form_group = new FormGroup({
        terms: new FormControl(false, [<any>Validators.required]),
        reg_type: new FormControl(this.userService.setUserType(),
                [<any>Validators.required]),
        first_name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(30)]),
        last_name: new FormControl('',
            [<any>Validators.required, Validators.maxLength(30)]),
        email: new FormControl(''),
        phone_number: new FormControl(''),
        password: new FormControl(''),
        password_confirm: new FormControl('')

    })

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private modalService: ModalService,
        private alertService: AlertService) { }

    ngOnInit() {
        if(this.route.snapshot.queryParams.returnUrl) {
            this.userService.getUserType('buyer');
        }
        console.log(this.form_group)
        this.form_group.valueChanges.subscribe(x => {
            // console.log('Form changed')
            // console.log(x)
            this.model = Object.assign({}, x)
            delete this.model.terms;
        });
    }

    showPassword() {
        this.show = !this.show;
    }

    register() {
        this.form_group.setValidators([CustomValidator.matchPassword]);
        this.form_group.controls['email'].setValidators([<any> Validators.required, Validators.maxLength(254), <any> Validators.email]);
        this.form_group.updateValueAndValidity();
        this.form_group.controls['email'].updateValueAndValidity();
        if (this.form_group.get('phone_number').value) {
            this.form_group.controls['phone_number'].setValidators([<any> Validators.maxLength(13)]);
            this.form_group.controls['phone_number'].updateValueAndValidity();
        }
        this.form_group.controls['password'].setValidators([<any>Validators.required, <any>Validators.minLength(6)]);
        this.form_group.controls['password'].updateValueAndValidity();
        this.form_group.controls['password_confirm'].setValidators([<any>Validators.required, <any>Validators.minLength(6)]);
        this.form_group.controls['password_confirm'].updateValueAndValidity();

        if (!this.form_group.valid || !this.form_group.controls.terms.value){
            new FormService().markTouched(this.form_group)
            return;
        }

        if(this.form_group.valid) {
            this.isLoading = true;
        }
        this.form_group.disable();
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.data = data;
                    this.router.navigate(['/register/register-step-two']);
                    this.userService.saveCurrentUser(this.data)
                    //localStorage.setItem('currentUser', JSON.stringify(this.data.token));
                },
                error => {
                    this.form_group.enable();
                    this.alertService.errorRegistration(error, this.form_group);
                    this.isLoading = false;

                });
    }

    openModal(type) {
        if(type === 'terms') this.isTermsOpened = true;
        else this.isTermsOpened = false;
        this.modalService.open('terms-privacy');
    }

    closeModal() {
        this.modalService.close('terms-privacy')
    }
}
