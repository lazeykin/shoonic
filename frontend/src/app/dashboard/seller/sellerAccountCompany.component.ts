import { FormService } from './../../_services/form';
import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_models/index';
import {UserService, ModalService, AlertService} from '../../_services/index';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ProductsService} from '../../_services';
import {Router} from '@angular/router';
import {CustomValidator} from '../../_services/custom_validators';
import {LanguageService} from '../../_services/language.service';


@Component({
    templateUrl: 'sellerAccountCompany.component.html',
    styleUrls: ['sellerAccountCompany.component.sass']
})

export class SellerAccountCompanyComponent implements OnInit {
    url: string;
    countries: any = [];
    productChoises: any = {};
    isLoading: boolean = false;
    dataCompany: any = {};
    model: any = {
        name: '',
        vat_number: '',
        website_address: '',
        logo: '',
        address: {
            name: '',
            street_name: '',
            street_number: '',
            bus: '',
            country: '',
            state: '',
            city: '',
            zip: ''
        }
    };

    styles = {
        'margin-bottom': '24px'
    }
    form_group = new FormGroup({
        address: new FormGroup({
            zip: new FormControl('',
                [<any>Validators.required, <any>CustomValidator.zipCodeValidator, <any>Validators.maxLength(80)]),
            city: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            state: new FormControl('', [<any>Validators.maxLength(80)]),
            street_name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            country: new FormControl('', [<any>Validators.required]),
            street_number: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            bus: new FormControl('', [<any>Validators.maxLength(10)])
        }),
        website_address: new FormControl('',
            [<any>CustomValidator.urlValidator, <any>Validators.maxLength(200)]),
        vat_number: new FormControl('',
            [<any>Validators.required, <any>Validators.maxLength(80)]),
        logo: new FormControl(''),
        name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)])
    });

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private userService: UserService,
        private productsService: ProductsService,
        private alertService: AlertService,
        private router: Router,
        private modalService: ModalService,
        private formService: FormService,
        private languageService: LanguageService) {
    }

    ngOnInit() {
        console.log(this.form_group);
        this.form_group.valueChanges.subscribe(x => {
            this.model = Object.assign({}, x);
        });
        this.form_group.controls.logo.valueChanges.subscribe(x => {
            if (x !== null && x !== undefined && x.type) {
                this.sendLogo(x);
            }
        })
        this.languageService.currentLanguage.subscribe(lang => {
        this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
            .subscribe(
                data => {
                    this.productChoises = data;
                    this.countries = this.productChoises.country;
                    this.getPersonalInfo();
                },
                error => {
                    console.log('Eror data');
                });
        })
    }
    getPersonalInfo() {
        this.userService.getPersonalInfo(this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.dataCompany = data;
                    this.form_group.patchValue(this.dataCompany.company);
                },
                error => {
                    this.alertService.errorRegistration(error, this.form_group);
                });
    }
    closeModal(id: string) {
        this.modalService.close(id);
        this.router.navigate(['/dashboard/seller']);
    }

    editCompanyInfo() {
        this.isLoading = true;
        if(this.form_group.valid) {
            this.form_group.disable();
            this.model.address.country = this.model.address.country.id;
            if (!this.model.logo) {
                delete this.model.logo;
            }
            this.userService.editCompanyInfo(this.model, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        this.modalService.open('custom-modal-2');
                    },
                    error => {
                        this.form_group.enable();
                        this.isLoading = false;
                        new FormService().markTouched(this.form_group);
                        this.alertService.errorRegistration(error, this.form_group);
                    });
            }
            else {
                this.formService.markTouched(this.form_group);
                this.isLoading = false;
            }
    }

    sendLogo(file) {
        this.productsService.uploadImage(file, this.userService.getCurrentUserToken()).subscribe(
            data => {
                this.model.logo = data;
                this.form_group.controls.logo.setValue(data);
            },
            error => {
                console.log(error);
            });
    }

    compareTech(t1, t2): boolean {
        return t1 && t2 ? t1 === t2 : t1 === t2;
    }

}

