import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from '../../_models/index';
import { UserService, ModalService, AlertService } from '../../_services/index';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ProductsService} from '../../_services';
import {FormService} from '../../_services/form';

@Component({
    templateUrl: 'buyerAccount.component.html',
    styleUrls: ['buyerAccount.component.sass']
})

export class BuyerAccountComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    
    url: string | ArrayBuffer;
    model: any = {};
    dataUser: any = {};
    fileToUpload: File = null;
    form_group = new FormGroup({
        photo: new FormControl({}),
        first_name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
        last_name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
        email: new FormControl('', [Validators.required, Validators.email])
    })
    oldEmail: string;
    constructor(
    	@Inject(DOCUMENT) private document: Document,
    	private userService: UserService,
        private alertService: AlertService,
        private productsService: ProductsService,
        private modalService: ModalService,
    ) { }

    getPersonalInfo() {
        this.userService.getPersonalInfo(this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.dataUser = data;
                    if (this.dataUser.photo) {
                        this.model.photo = this.dataUser.photo;
                        if (!this.model.photo.thumbnail_200) {
                            this.url = this.model.photo.url;
                        } else {
                            this.url = this.model.photo.thumbnail_200;
                        }
                    }
                    this.model.email = this.dataUser.email;
                    this.oldEmail =  this.dataUser.email;
                    this.model.first_name = this.dataUser.first_name;
                    this.model.last_name = this.dataUser.last_name;
                },
                error => {
                    this.alertService.errorRegistration(error, this.form_group);
                });
    }

    ngOnInit() {
        this.getPersonalInfo();
    }

    closeModal(id: string){
        this.modalService.close(id);
        this.getPersonalInfo();
    }

    editPersonalInfo(model) {
        if (!this.form_group.valid) {
            new FormService().markTouched(this.form_group)
            return;
        }
        if (!model.photo) {
            delete model.photo;
        }
        this.userService.editPersonalInfo(model, this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.userService.getPersonalInfo(this.userService.getCurrentUserToken())
                        .subscribe(
                            data => {
                                this.dataUser = data;
                                if (this.oldEmail !== this.form_group.get('email').value) {
                                    this.modalService.open('change-email');
                                }
                                this.model.email = this.dataUser.email;
                                this.model.first_name = this.dataUser.first_name;
                                this.model.last_name = this.dataUser.last_name;
                            },
                            error => {
                                this.alertService.errorRegistration(error, this.form_group);
                            });
                    if (this.oldEmail === this.form_group.get('email').value) {
                        this.modalService.open('custom-modal-2');
                    }
                },
                error => {
                    new FormService().markTouched(this.form_group);
                    this.alertService.errorRegistration(error, this.form_group);
                });
    }

    readUrl(event:any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.onload = (event: ProgressEvent) => {
                this.url = (<FileReader>event.target).result;
            }

            reader.readAsDataURL(event.target.files[0]);
        }
        this.fileToUpload = event.target.files[0];
        if (this.fileToUpload) {
            this.productsService.uploadImage(this.fileToUpload, this.userService.getCurrentUserToken()).subscribe(
                data => {
                    this.model.photo = data;
                },
                error => {
                    console.log(error);
                });
        }  
    }
}
