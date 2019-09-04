import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from '../../_models/index';
import { UserService, ModalService, AlertService } from '../../_services/index';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {AbstractControl, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
    templateUrl: 'sellerAccountPassword.component.html'
})

export class SellerAccountPasswordComponent implements OnInit {
    show = false;
    model: any = {};
    areFieldsEmpty: boolean = false;
    isLoading: boolean;
    form_group = new FormGroup({
        old_password: new FormControl('', [<any>Validators.required]),
        password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(6)]),
        password_confirm: new FormControl('' ,[<any>Validators.required, <any>Validators.minLength(6)])
    })
    constructor(

    	@Inject(DOCUMENT) private document: Document,
    	private userService: UserService,
        private alertService: AlertService,
        private modalService: ModalService) {
    }

    ngOnInit() {
        this.form_group.valueChanges.subscribe(value => {
            this.model = Object.assign({}, value)
        })
    }

    closeModal(id: string){
        this.modalService.close(id);
        location.reload();
    }

    showPassword() {
        this.show = !this.show;
    }
    editPassword(e) {
        Object.keys(this.form_group.controls).forEach((control: string) => {
            const typedControl: AbstractControl = this.form_group.controls[control];
            if(!typedControl.value) {
                console.log('inside')
                this.areFieldsEmpty = true;
            }
        });

        if(e.type === 'submit') {
            setTimeout(()=>{
                this.form_group.disable()
            },0);
            console.log(this.model);
            this.userService.editPassword(this.model, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        this.areFieldsEmpty = false;
                        this.modalService.open("custom-modal-2");
                    },
                    error => {
                        this.form_group.enable();
                        this.isLoading = false;
                        this.alertService.errorRegistration(error, this.form_group);
                    });
        }
    }
}
