import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from '../../../../_models/index';
import { AlertService, ProductsService, UserService, ModalService } from '../../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {FormArray, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {LanguageService} from '../../../../_services/language.service';
import {IChoises} from '../../../../_models/choises';
import {CustomValidator} from '../../../../_services/custom_validators';
import {FormService} from '../../../../_services/form';

@Component({
    templateUrl: 'prepacks.component.html',
    styleUrls: ['prepacks.component.sass']
})

export class MessengerPrepacksComponent implements OnInit {
    @ViewChild('f') public form: NgForm;

    prepacks: any = [];
    outputSizes: any = [];
    sizes: any =  {
     "": "",
    };
    sizesMenEur: any = {
        '34': '', '35': '', '36': '','37': '', '38': '', '39': '', '39.5': '', '40': '', '40.5': '', '41': '', '41.5': '', '42': '', '42.5': '', '43': '', '44': '',
        '44.5': '', '45': '', '46': '', '46.5': '', '47': '', '48': '',
    };
    sizesMenUs: any = {
        '2.5': '', '3.0': '', '4.0': '', '4.5': '', '5.5': '', '6.5': '', '7.0': '', '7.5': '', '8.0': '', '8.5': '',
        '9.0': '', '9.5': '', '10.0': '', '10.5': '', '11.0': '', '11.5': '', '12.0': '', '12.5': '', '13.0': '', '13.5': ''
    };
    sizesMenUk: any = {
        '2.0': '', '3.0': '', '3.5': '', '4.0': '', '5.0': '', '6.0': '', '6.5': '', '7.0': '', '7.5': '', '8.0': '',
        '8.5': '', '9.0': '', '10.0': '', '10.5': '', '11.0': '', '11.4': '', '12.0': '', '13.0': ''};

    sizesWomenEur: any = {'35':'','36': '', '37': '','37.5': '', '38': '', '39': '','39.5': '', '40': '', '41': '','41.5': '', '42': '','42.5': '', '43': ''};
    sizesWomenUs: any = {
        '5.5': '', '6.0': '', '6.5': '', '7.0': '', '7.5': '','5.0': '', '8.0': '', '8.5': '', '9.0': '', '9.5': '',
        '10.0': '', '10.5': '', '11.0': '', '11.5': ''};
    sizesWomenUk: any = {
        '3.0': '','3.5': '', '4.0': '', '4.5': '', '5.0': '', '5.5': '', '6.0': '', '6.5': '', '7.0': '', '7.5': '', '8.0': '',
        '8.5': '', '9.0': '', '9.5': '', '10.0': ''
    };

    sizesKidsEur: any = {
        '17': '', '18': '', '19': '', '20': '', '21': '', '22': '', '23': '', '24': '', '25': '', '26': '',
        '27': '', '28': '', '29': '','30': '', '31': '', '32': '','33': ''
    };
    sizesKidsUs: any = {
        '2.0': '', '2.5': '', '3.5': '', '4.0': '', '5.0': '', '5.5': '', '6.5': '', '7.0': '', '8.0': '', '8.5': '', '9.5': '',
        '10.5': '', '11.5': '', '12.0': '', '13.0': '', '1.0': '', '1.5': ''
    };
    sizesKidsUk: any = {
        '1.5': '','2.0': '', '3.0': '', '3.5': '', '4.5': '', '5.0': '', '6.0': '', '6.5': '', '7.5': '', '8.0': '', '9.0': '',
        '10.0': '', '11.0': '', '11.5': '', '12.5': '', '13.5': '', '1.0': ''
    };
    model: any = {};
    displayForm: boolean = false;
    hideButton: boolean = false;
    noZeroSizeMessage = false;
    form_prepack = new FormGroup({
        name: new FormControl('', [Validators.required]),
        size_type: new FormControl(null),
        sizes: new FormControl({}, [CustomValidator.checkSizes]),
        gender: new FormControl(null)
    });
    sizeType: { id: number, name: string }[]  = [
        {id: 0, name: 'EUR'},
        {id: 1, name: 'US'},
        {id: 2, name: 'UK'}
    ];
    genders: {id: number, name: string}[] = [];
    showNumber: number = 10;
    showAll = false;
    Object = Object;
    prepackId: number;

    constructor(        
    	@Inject(DOCUMENT) private document: Document,
     	private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private alertService: AlertService,
    	private userService: UserService,
        private langService: LanguageService) {
    }

    ngOnInit() {
       this.getPrepacks();
        this.langService.currentLanguage.subscribe(lang => {
            this.productsService.productChoises(this.userService.getCurrentUserToken(),lang)
                .subscribe((choises: IChoises) => {
                    this.genders = choises.gender;
            }
                );
        });
        this.form_prepack.valueChanges.subscribe(value => {
            this.model = value;
        })
    }

    getPrepacks() {
        this.productsService.allSellerPrepacks(this.userService.getCurrentUserToken()).subscribe(response => {
            this.prepacks = response;
         });
         this.outputSizes = Object.entries(this.sizes).map(([key, value]) => ({key,value}));
    }

    addPrepack () {
        this.displayForm = true;
    }

    editPrepack(id) {
        this.hideButton = true;
        this.displayForm = true;
        this.form_prepack.patchValue({
            size_type: null,
            sizes: {},
            gender: {}
        });
        this.productsService.editPrepack(this.userService.getCurrentUserToken(), id).subscribe(response => {
            this.model = response;
            this.prepackId = id;
            this.form_prepack.patchValue(this.model);
            this.sizes = this.form_prepack.get('sizes').value;
        });
    }

    deletePrepack(id) {
        this.productsService.deletePrepack(this.userService.getCurrentUserToken(), id).subscribe(response => {
            this.getPrepacks();
        });
    }


    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
    savePrepack () {
        if (!this.form_prepack.valid) {
            new FormService().markTouched(this.form_prepack);
            return
        }
        let sizes = Object.assign({}, this.model.sizes);
        Object.keys(sizes).forEach((key) => (sizes[key] == 0) && delete sizes[key]);
        this.model.sizes = sizes;

        if (this.hideButton) {
            this.productsService.updatePrepack(this.model, this.prepackId, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        this.hideButton = false;
                        this.displayForm = false;
                        this.getPrepacks();
                        this.sizes = {"": ""};
                        this.alertService.clearAlert();
                    },
                    error => {
                        this.alertService.errorRegistration(error, this.form_prepack);
                    });
        } else {
            this.productsService.saveNewPrepack(this.model, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        this.hideButton = false;
                        this.displayForm = false;
                        this.getPrepacks();
                        this.sizes = {"": ""};
                        this.alertService.clearAlert();
                        this.form_prepack.patchValue({
                            name: '',
                            size_type: null,
                            sizes: {},
                            gender: {}
                        });
                    },
                    error => {
                        this.alertService.errorRegistration(error, this.form_prepack);
                    });
        }


    }

    addPrepackSizes() {
        this.outputSizes.push({
            key: "", value: ""
        });
    }

    removePrepackSizes(index) {
        this.outputSizes.splice(index,1);
    }
    selectMethod() {
        if (!this.form_prepack.get('size_type').value || !this.form_prepack.get('gender').value) {
           return
        }
            if (this.form_prepack.controls.gender.value.id === 2) {
                if (this.form_prepack.value.size_type.id === 0) {
                    this.sizes = Object.assign({}, this.sizesMenEur) ;
                } else if (
                    this.form_prepack.value.size_type.id === 1) {
                    this.sizes = Object.assign({}, this.sizesMenUs);
                } else if (
                    this.form_prepack.value.size_type.id === 2) {
                    this.sizes = Object.assign({}, this.sizesMenUk);
                }
            } else if (this.form_prepack.controls.gender.value.id === 1) {
                if (
                    this.form_prepack.value.size_type.id === 0) {
                    this.sizes = Object.assign({}, this.sizesWomenEur);
                } else if (
                    this.form_prepack.value.size_type.id === 1) {
                    this.sizes = Object.assign({}, this.sizesWomenUs);
                } else if (
                    this.form_prepack.value.size_type.id === 2) {
                    this.sizes = Object.assign({}, this.sizesWomenUk);
                }
            } else if (this.form_prepack.controls.gender.value.id === 3
                || this.form_prepack.controls.gender.value.id === 4) {
                if (
                    this.form_prepack.value.size_type.id === 0) {
                    this.sizes = Object.assign({}, this.sizesKidsEur);
                } else if (
                    this.form_prepack.value.size_type.id === 1) {
                    this.sizes = Object.assign({}, this.sizesKidsUs);
                } else if (
                    this.form_prepack.value.size_type.id === 2) {
                    this.sizes = Object.assign({}, this.sizesKidsUk);
                }
        }
    }
    seeMoreDesc() {
        this.showAll = !this.showAll;
        if (this.showNumber === 10) {
            this.showNumber = 30
        } else {
            this.showNumber = 10
        }
    }
    onInputSize() {
        (this.form_prepack.get('sizes')).setValue(this.sizes);
        (this.form_prepack.get('sizes')).markAsPristine();
    }
}
