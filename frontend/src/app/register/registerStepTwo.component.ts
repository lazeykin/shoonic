import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, UserService } from '../_services/index';
import {ModalService, ProductsService} from '../_services';
import {FormControl, FormGroup, NgForm, Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { CustomValidator } from '../_services/custom_validators';
import { FormService } from '../_services/form';
import {LanguageService} from '../_services/language.service';
// import {MatSnackBar} from '@angular/material';

@Component({
    templateUrl: 'registerStepTwo.component.html',
    styleUrls: ['../_directives/header.component.css', './registerStepTwo.component.css']
})

export class RegisterStepTwo implements OnInit {
    showError = false;
    countries: any = [];
    currencies: any = [];
    countrySelect : any = {};
    productChoises : any = {};
    isLoading: boolean = false;
    company_info_model = {
        name: "",
        vat_number: "",
        website_address: "",
        address: {
            name: "",
            first_line: "",
            second_line: "",
            country: "",
            state: "",
            city: "",
            zip: ""
        }
    }

    form_group = new FormGroup({
        name: new FormControl('',
            [<any>Validators.required, <any>Validators.maxLength(80)]
        ),
        website_address: new FormControl('',
            [<any>CustomValidator.urlValidator, <any>Validators.maxLength(200)]),
        vat_number: new FormControl('',
            [<any>Validators.required, <any>Validators.maxLength(80)]
        ),
        address: new FormGroup({
            city: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]
            ),
            country: new FormControl('',
                [<any>Validators.required]),
            state: new FormControl('',
                [<any>Validators.maxLength(80)]),
            street_name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            zip: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(20)]),
            street_number: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(20)]),
            bus: new FormControl('', [<any>Validators.maxLength(20)])
        }),

    });

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private userService: UserService,
        private modalService: ModalService,
        private productsService: ProductsService,
        public FormService: FormService,
        private alertService: AlertService,
        private languageService: LanguageService) { }

    closeModal(id: string){
        this.modalService.close(id);
        this.router.navigate(['/']);
    }

    ngOnInit() {
        console.log(this.form_group);
        this.languageService.currentLanguage.subscribe(lang => {
        this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
            .subscribe(
                data => {
                    this.productChoises = data;
                    this.countries = this.productChoises.country;
                },
                error => {
                    console.log("Eror data");
                });
        });

        this.form_group.valueChanges.subscribe(x => {
            console.log('Form changed')
            console.log(x)
            this.company_info_model = Object.assign({}, x)
        });

    }

    registerCompany() {
        this.company_info_model.address.name = this.company_info_model.name;
        this.company_info_model.address.country = this.company_info_model.address['country']['id'];
        console.log(this.company_info_model)
        if (!this.form_group.valid){
            new FormService().markTouched(this.form_group)
            return;
        }
        if(this.form_group.valid) {
            this.isLoading = true;
        }

        this.FormService.markTouched(this.form_group);
        setTimeout( () => {
            this.form_group.disable();
        }, 0)
            this.userService.createCompany(this.company_info_model, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        this.modalService.open("custom-modal-2");
                        this.userService.saveCurrentUser(null)
                        // localStorage.removeItem('currentUser');
                    },
                    error => {
                        this.form_group.enable();
                        this.alertService.errorRegistration(error, this.form_group);
                        this.isLoading = false;

                    });

    }

    goToPreviousStep() {
        this.router.navigate(['register/register-step-one'])
    }

    compareTech(t1, t2): boolean {
        return t1 && t2 ? t1.id === t2.id : t1 === t2;
    }

}
