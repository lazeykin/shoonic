import { LanguageService } from './../../../_services/language.service';
import { TranslatePipe } from './../../../pipes/translate.pipe';
import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, ModalService, ProductsService, UserService} from '../../../_services';
import {Router} from '@angular/router';
import {CustomValidator} from '../../../_services/custom_validators';
import {FormService} from '../../../_services/form';

@Component({
    selector: 'app-add-edit-product-two',
    templateUrl: './add-edit-product-two.component.html',
    styleUrls: ['./add-edit-product-two.component.css']
})
export class AddEditProductTwoComponent implements OnInit, OnChanges {
    @Input('group') form_group: FormGroup;
    @Input() genders: any;
    @Input() styles: any;
    @Input() colors: any;
    @Input() brands: any;
    @Input() product: any;
    @Input() prepacks: any;
    @Input() currencies: any;
    @Input() composition_inner: any;
    @Input() composition_outer: any;
    showNumber: number = 10;
    inputText: any;
    showAll = false;
    collectionOrStock: any = [{id: 0, value: true, name: 'TEXT_COLLECTION'},
        {id: 1, value: false, name: 'TEXT_STOCK'}];
    collectionOrStockTranslated: any = [];
    typePr: string = '';
    sizeType: any = [
        {id: 0, name: 'EUR'},
        {id: 1, name: 'US'},
        {id: 2, name: 'UK'},
    ];
    showPrepackSizes: any = [];
    displayErorQuantity: boolean = false;
    prepacksList: any = [];
    saleType: string;
    prepackSelect: any = [];
    prepackItem: any = {};
    i: number;
    j: number;
    model: any = {};
    outputSizes: any = [];
    showSizes = false;
    showCustomPrepack: any = [];
    showBrandModal: boolean = false;
    customPrepackName: any = [];
    emptyPrepack: boolean = false;
    enterPrepackName: any = [];
    customPrepackSizes: any = [];
    enterPrepackSize: any = [];
    sizes: any = {};
    CustomPrepacksizes: any = [];
    priceType: any = [{id: 0, name: 'TEXT_FIXED_PRICE', value: false},
        {id: 1, name: 'TEXT_BIDDING', value: true}];
    priceTypeTranslated: any = [];
    finishPrepack: any = [];
    customPrepackFinalSizes: any = [];
    emptyCustomPrepack: boolean = false;
    displayErorDuplicatePrepacks: boolean = false;
    displayErorDuplicateNamesPrepacks: boolean = false;
    customPrepackQuauntity: any = [];
    prepackQuauntity: any = [];
    brandsStyle = {
        'max-height': '84px'
    }
    marginAddPrepack: boolean = false;

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

    form_brand = new FormGroup({
            name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            sub_title: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(160)]),
            website_address: new FormControl('',
                [<any>Validators.maxLength(200), <any>CustomValidator.urlValidator])
        }
    )

    model_brand: any;
    errorMessage: string;
    nonFieldError: any;

    constructor(
        private productsService: ProductsService,
        private modalService: ModalService,
        private userService: UserService,
        private translatePipe: TranslatePipe,
        private langService:LanguageService,
        private router: Router,
        private alertService: AlertService
    ) {
    }
    

    ngOnInit() {
        // this.form_group.controls.gender.valueChanges.subscribe(() => {
        //     this.selectMethod();
        // })
        this.langService.currentLanguage.subscribe(lang => {
            setTimeout(this.translateValues.bind(this), 2000);
        })

        this.form_brand.valueChanges.subscribe(x => {
            this.model_brand = Object.assign({}, x)
        })
    }

    translateValues() {
        this.collectionOrStockTranslated = this.collectionOrStock.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        this.priceTypeTranslated = this.priceType.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        if(this.priceTypeTranslated.some(e => {return e.name == undefined})) {
            setTimeout(this.translateValues.bind(this), 500);
        }
        if(this.collectionOrStockTranslated.some(e => {return e.name == undefined})) {
            setTimeout(this.translateValues.bind(this), 500);
        }
    }
    ngOnChanges(changes: SimpleChanges) {
         if (this.product !== 'undefined' && Object.keys(this.product).length !== 0) {
            let product: SimpleChange = changes.product;
            // console.log('prev value: ', product.previousValue);
            // console.log('got name: ', product.currentValue);
            console.log(this.product);
            if (this.product.sizes) {

                    this.showSizes = true;
                    this.product.sizes = this.form_group.controls.sizes.value;
                    console.log(this.product.sizes);
                    // todo: add part of the grid according to size type (https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript)
                    this.sizes = this.product.sizes;
                    this.typePr = 'sizes';
                    this.saleType = 'sizes';

            } else if (!this.product.sizes) {
                if (this.product.prepacks) {
                    for (let i = 0; i < this.product.prepacks.length; i++){
                        this.prepackQuauntity[i] = this.product.prepacks[i].available_quantity;
                        this.showPrepackSizes[i] = true;
                    }

                    this.typePr = 'prepacks';
                    this.saleType = 'prepacks';

                        const arr3 = this.product.prepacks.filter(e => this.prepacks.findIndex(i => i.name == e.name) === -1);
                        for (let i = 0; i < arr3.length; i++) {
                            this.prepacks.push(arr3[i]);
                        }
                        console.log(this.prepacks)

                } else {
                    this.typePr = 'sizes';
                    this.saleType = 'sizes';
                    this.outputSizes = Object.entries(this.sizes).map(([key, value]) => ({key, value}));
                }
            }
        }
    }

    setType(model) {
        this.typePr = model;
        console.log(model)
        if (model === 'prepacks') {
            this.addPrepack();
            (<FormArray> this.form_group.get('prepacks')).setValidators([CustomValidator.emptyArray]);
        } else {
            for (let i = 0;  (<FormArray> this.form_group.get('prepacks')).length; i++) {
                (<FormArray> this.form_group.get('prepacks')).removeAt(i);
            }
            (<FormArray> this.form_group.get('prepacks')).clearValidators();
        }
        if (this.typePr === 'prepacks') {
            this.displayErorQuantity = false;
            this.prepacksList.push(this.prepacks);
        }
    }


    selectThePrepack() {
        if (this.product.prepacks && this.product.prepacks.length > 0) {
            this.typePr = 'prepacks';
            this.saleType = 'prepacks';
            for (let i = 0; i < this.product.prepacks.length; i++) {
                this.prepacksList[i] = this.prepacks;
                this.prepackSelect[i] = this.product.prepacks[i];
                console.log(this.prepacksList);
            }
        } else {
            this.prepacksList[0] = this.prepacks;
        }
        for (let i = 0; i < this.prepacksList.length; i++) {
            this.prepackItem = this.prepacksList[i];
        }
        this.model.prepacks = this.prepackSelect;
        this.form_group.patchValue(this.model);
    }

    compareTech(t1, t2): boolean {
        return t1 && t2 ? t1.id === t2.id : t1 === t2;
    }


    removePrepack(i) {
        (<FormArray> this.form_group.get('prepacks')).removeAt(i);
        this.showCustomPrepack[i] = false;
    }
    onSelectBrand(brand) {
        if(brand.id === 0) {
            this.modalService.open('modal-add-brand');
        } else this.modalService.close('modal-add-brand')
    }
    onSelectPrepack(prepack?, i?) {
        if (prepack.id === 0) {
            this.showCustomPrepack[i] = true;
            this.marginAddPrepack = true;
        } else {
            this.showCustomPrepack[i] = false;
            this.marginAddPrepack = false;
            (<FormArray> this.form_group.get('prepacks')).at(i).patchValue(prepack);
        }
        console.log(this.showCustomPrepack)
    }

    addPrepack() {
        console.log(this.CustomPrepacksizes);
        (<FormArray> this.form_group.get('prepacks')).push(
            new FormGroup({
                    available_quantity: new FormControl(null, [CustomValidator.integer]),
                    company_id: new FormControl(null),
                    created_by_id: new FormControl(null),
                    date_created: new FormControl(null),
                    id: new FormControl(null),
                    name: new FormControl('', [Validators.required]),
                    sizes: new FormControl({}, [CustomValidator.checkSizes]),
                    size_type: new FormControl(''),
                    item: new FormControl('')
            })
        );
    }
    onPrepackSave(prepack: FormGroup) {
        console.log(prepack);
        if (! (<FormArray> this.form_group.get('prepacks')).valid) {
            (<FormArray> this.form_group.get('prepacks')).controls.forEach((group: FormGroup) => {
                (<any> Object).values(group.controls).forEach((control: FormControl) => {
                    new FormService().markTouched(group);
                })
            });
            return
        }
 
        let model = {sizes: {}};
        model = JSON.parse(JSON.stringify( prepack.value));
        console.log(model);
        Object.keys(model.sizes).forEach((key) => (model.sizes[key] == 0) && delete model.sizes[key]);
        this.productsService.saveNewPrepack( model, this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    console.log(data);
                    this.modalService.open('save_prepack');
                    this.alertService.clearAlert();
                },
                error => {
                    console.log(error);
                    this.alertService.errorProductEdit(error, prepack);
                    if ('non_fields_error' in error.error) {
                        window.scroll(0,0);
                    }
                });
    }
    selectMethod(index?) {
        this.j = index;
        if (this.form_group.controls.size_type.value) {
            if (this.form_group.controls.gender.value.id === 2) {
                if (this.form_group.controls.size_type.value.id === 0) {
                    this.sizes = this.sizesMenEur;
                } else if (this.form_group.controls.size_type.value.id === 1 ) {
                    this.sizes = this.sizesMenUs;
                } else if (this.form_group.controls.size_type.value.id === 2) {
                    this.sizes = this.sizesMenUk;
                }
            } else if (this.form_group.controls.gender.value.id === 1) {
                if (this.form_group.controls.size_type.value.id === 0) {
                    this.sizes = this.sizesWomenEur;
                } else if (this.form_group.controls.size_type.value.id === 1 ) {
                    this.sizes = this.sizesWomenUs;
                } else if (this.form_group.controls.size_type.value.id === 2 ) {
                    this.sizes = this.sizesWomenUk;
                }
            } else if (this.form_group.controls.gender.value.id === 3
                || this.form_group.controls.gender.value.id === 4) {
                if (this.form_group.controls.size_type.value.id === 0) {
                    this.sizes = this.sizesKidsEur;
                } else if (this.form_group.controls.size_type.value.id === 1 ) {
                    this.sizes = this.sizesKidsUs;
                } else if (this.form_group.controls.size_type.value.id === 2) {
                    this.sizes = this.sizesKidsUk;
                }
            }
        } else if (this.form_group.value.prepacks.length) {
            if (this.form_group.controls.gender.value.id === 2) {
                if (this.form_group.value.prepacks[index].size_type.id === 0) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesMenEur) ;
                } else if (
                    this.form_group.value.prepacks[index].size_type.id === 1) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesMenUs);
                } else if (
                    this.form_group.value.prepacks[index].size_type.id === 2) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesMenUk);
                }
            } else if (this.form_group.controls.gender.value.id === 1) {
                if (
                    this.form_group.value.prepacks[index].size_type.id === 0) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesWomenEur);
                } else if (
                    this.form_group.value.prepacks[index].size_type.id === 1) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesWomenUs);
                } else if (
                    this.form_group.value.prepacks[index].size_type.id === 2) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesWomenUk);
                }
            } else if (this.form_group.controls.gender.value.id === 3
                || this.form_group.controls.gender.value.id === 4) {
                if (
                    this.form_group.value.prepacks[index].size_type.id === 0) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesKidsEur);
                } else if (
                    this.form_group.value.prepacks[index].size_type.id === 1) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesKidsUs);
                } else if (
                    this.form_group.value.prepacks[index].size_type.id === 2) {
                    this.CustomPrepacksizes[index] = Object.assign({}, this.sizesKidsUk);
                }
            }
        }


        if (this.form_group.controls.saleType.value === 'prepacks') {
            this.showPrepackSizes[index] = true;
            console.log(this.CustomPrepacksizes);
            console.log(this.sizesMenEur)

        } else if (this.form_group.controls.saleType.value === 'sizes') {
            this.showSizes = true;
            console.log(this.sizes);
            this.form_group.get('sizes').setValue(this.sizes);
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

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        console.log(this.sizes);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    onInputSize(type, i?) {
        if (type === 'sizes') {
            this.form_group.get('sizes').setValue(this.sizes);
        } else {
            (<FormArray> this.form_group.get('prepacks')).at(i)['controls']['sizes'].setValue(this.CustomPrepacksizes[i]);
            (<FormArray> this.form_group.get('prepacks')).at(i)['controls']['sizes'].markAsPristine();
        }

    }

    closeModal(id) {
        this.modalService.close(id);
        if (id === 'modal-add-brand') {
            this.form_group.controls.brand.setValue(null);
            this.form_brand.reset();
            this.form_brand.get('website_address').setValue('');
        }

    }

    saveBrandNew() {
        if (!this.form_brand.valid){
            new FormService().markTouched(this.form_brand)
            return;
        }
        
        this.productsService.saveBrandNew(this.model_brand, this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.productsService.allBrands(this.userService.getCurrentUserToken()).subscribe(response => {
                        this.brands = response;
                        let created = this.brands.filter(x => x.id === data['id'])[0]
                        console.log(created);
                        this.form_group.controls.brand.setValue(created)
                        this.form_brand.reset();
                        this.form_brand.get('website_address').setValue('');
                        console.log(this.form_brand)
                        this.brands.unshift({
                            id: 0,
                            name: this.translatePipe.transform('TEXT_CUSTOM')
                        })
                        this.modalService.close('modal-add-brand')
                        this.modalService.open('save_brand');
                    });
                },
                error => {
                    if (error.error['non_fields_error']) {
                        this.errorMessage = this.alertService.errorBrand(error.error);
                    } else {
                        this.alertService.errorRegistration(error, this.form_group);
                    }
                });
    }

    onBgClick(id:string, e: any) {
        if(!$(e.target).closest('.modal-body').length)
            this.closeModal(id);
    }
}
