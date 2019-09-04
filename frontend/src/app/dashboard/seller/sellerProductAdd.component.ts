import { TranslatePipe } from './../../pipes/translate.pipe';
import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, ModalService, ProductsService, UserService, ShowroomsService} from '../../_services/index';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../_services/form';
import {FormImagesComponent} from '../../components/form/form-images/form-images.component';
import {AddEditProductTwoComponent} from '../../components/form/add-edit-product-two/add-edit-product-two.component';
import {CustomValidator} from '../../_services/custom_validators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LanguageService } from '../../_services/language.service';

@Component({
    selector: 'app-seller-add',
    templateUrl: 'sellerProductAdd.component.html',
    styleUrls: ['sellerProductAdd.component.css'],
})

export class SellerProductAddComponent implements OnInit {

    @ViewChild(AddEditProductTwoComponent) child:AddEditProductTwoComponent;
    @Input() disableShowroom: boolean;

    form_group = new FormGroup({
        currency: new FormControl('', [Validators.required]),
        default_image: new FormControl(''),
        description: new FormControl(''),
        images: new FormArray([]),
        country_of_origin: new FormControl('', [Validators.required]),
        price: new FormControl('', [Validators.required, CustomValidator.isPositive]),
        minimal_price: new FormControl(null),
        sales_identity: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        color: new FormControl('',),
        gender: new FormControl('', [Validators.required]),
        style: new FormControl('',),
        brand: new FormControl('',),
        prepacks: new FormArray([]),
        sizes: new FormControl(null),
        saleType: new FormControl('', [Validators.required]),
        is_collection: new FormControl({id: 1, value: false, name: 'Stock'}),
        collection_shipping_date: new FormControl(null),
        packing_type: new FormControl(''),
        customer_ref_number: new FormControl('', [Validators.maxLength(30)]),
        price_type: new FormControl({id: 1, name: 'Biding', value: true}),
        size_type: new FormControl(''),
        recommended_retail_price: new FormControl(null),
        discount_price: new FormControl(''),
        discount_end_date: new FormControl(null),
        sub_title: new FormControl('', [<any> Validators.maxLength(100)]),
        tags: new FormControl('', [<any> CustomValidator.tags]),
        article_number: new FormControl('', [<any> Validators.maxLength(30)]),
        destination: new FormControl('', [Validators.required]),
        showroom: new FormControl(''),
        composition_upper: new FormControl(''),
        composition_sock: new FormControl(''),
        composition_lining: new FormControl(''),
        composition_outer_sole: new FormControl('')

    }, [<any> CustomValidator.checkDiscount, <any> CustomValidator.checkMinimalPrice,
        <any> CustomValidator.checkForLessRecomenPrice, <any> CustomValidator.checkForLessPromoPrice]);

    model: any = {};
    stepOne = true;
    stepTwo = false;
    stepThree = false;
    productInfoAdd: any = {};
    node: any = {};
    productChoises: any = {};
    currencies: any = [];
    countries: any = [];
    genders: any = [];
    styles: any = [];
    colors: any = [];
    packingType: any = [];
    conditions: any = [];
    widths: any = [];
    heel_heights: any = [];
    sales: any = [];
    brands: any = [];

    composition_inner: any = [];
    composition_outer: any = [];

    product: any = {};
    prepacks: any = [];
    productAdd = true;
    productPreview = false;
    isLoading = false;

    filesToUpload: any = [];
    filesUploaded: number = 0;
    areFilesUploaded: boolean;
    totalCounter: number = 0;
    validCounter: number = 0;
    errorCounter: number = 0;
    errorMsg: any = [];
    fileNames: any = [];

    text_custom: string = '';

    isTemplateUploading = false;
    isAddingMultiple = false;
    productImportInfo:any = {};
    
    // showrooms
    destinations: any = [];
    showrooms: any = [];
    toShowroom = false;
    showroomId: string;
    @Output() sendProduct = new EventEmitter();
    @Output() createNew = new EventEmitter<boolean>();
    data: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productsService: ProductsService,
        private userService: UserService,
        private alertService: AlertService,
        public modalService: ModalService,
        private http: HttpClient,
        private showroomService: ShowroomsService,
        private translatePipe: TranslatePipe,
        private langService:LanguageService,
    ) {
        this.text_custom = this.translatePipe.transform('TEXT_CUSTOM');
    }

    translateValues() {
        let dest = [{id: 0, name: 'OPTION_SHOWROOM'}, {id: 1, name: 'OPTION_CATALOG'}, {id: 2, name: 'OPTION_CONCEPT'}];
        this.destinations = dest.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        if(this.destinations.some(e => {return e.name == undefined})) {
            setTimeout(this.translateValues.bind(this), 500);
        }
        if (this.disableShowroom === true) {
            this.form_group.controls.destination.setValue(this.destinations[0].id);
            this.form_group.controls.destination.disable();
            this.form_group.controls.showroom.disable();
            this.form_group.controls.destination.clearValidators();
        }
    }

    ngOnInit() {
        this.langService.currentLanguage.subscribe(lang => {
            setTimeout(this.translateValues.bind(this), 2000);
        })
        this.getShowrooms();
        this.showroomId = this.route.snapshot.queryParams.id;
        if(this.showroomId) {
            //this.form_group.controls.destination.setValue(this.destinations[0]);
            this.form_group.controls.destination.markAsTouched();
            this.disableShowroom = true;
        }
        window.scroll(0,0);

        console.log(this.form_group);
        this.form_group.valueChanges.subscribe(value => {
            console.log(this.form_group.errors)
            this.model = Object.assign({}, value);
            console.log(this.model);
            if (this.model.discount_price === null) {
                this.form_group.controls['discount_price'].clearValidators();
                this.form_group.get('discount_end_date').clearValidators();
            }
            if (this.model.minimal_price === null) {
                this.form_group.controls['minimal_price'].clearValidators();
            }
            if (this.model.recommended_retail_price === null) {
                this.form_group.controls['recommended_retail_price'].clearValidators();
            }
            if (this.form_group.controls.destination.value) {
                if (this.form_group.controls.destination.value.id === 0) {
                    this.toShowroom = true;
                    this.form_group.controls.showroom.setValidators(Validators.required);
                }
            else {
                this.toShowroom = false;
                this.form_group.controls.showroom.clearValidators();
            }
        }
            console.log(this.model.showroom);
        });
        this.langService.currentLanguage.subscribe(lang => {
            this.productsService.productChoises(this.userService.getCurrentUserToken(),lang)
                .subscribe(
                    data => {
                        this.productChoises = data;
                        console.log(data);
                        this.currencies = this.productChoises.currency;
                        this.countries = this.productChoises.country;
                        this.genders = this.productChoises.gender;
                        this.styles = this.productChoises.style;
                        this.colors = this.productChoises.color;
                        this.packingType = this.productChoises.packing_type;
                        this.conditions = this.productChoises.condition;
                        this.widths = this.productChoises.width;
                        this.heel_heights = this.productChoises.heel_height;
                        this.composition_inner = this.productChoises.composition_upper_linning_sock;
                        this.composition_outer = this.productChoises.composition_Outer;
                    }
                );
        });
        
        this.productsService.allSI(this.userService.getCurrentUserToken()).subscribe(response => {
            this.sales = response;
            this.sales.unshift({
                id: 0,
                name: 'Custom'
            })
        });
        this.productsService.allBrands(this.userService.getCurrentUserToken()).subscribe(response => {
            this.brands = response;
            this.brands.unshift({
                id: 0,
                name: 'Custom'
            })
        });
        this.productsService.allSellerPrepacks(this.userService.getCurrentUserToken()).subscribe(response => {
            this.prepacks = response;
            console.log(this.prepacks);
            this.prepacks.unshift({
                id: 0,
                name: 'Custom'
            });
        })
        console.log(this.showrooms);
    }

    getShowrooms() {
        var query = "&limit=100&offset=0"
        this.showroomService.activeShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    console.log('Response');
                    console.log(data);
                    this.showrooms = data['results'];
                    console.log(this.showrooms);
                }
            )
    }

    onNext() {
        this.stepTwo = true;
        this.stepOne = false;
        window.scroll(0, 0);
        this.form_group.controls.default_image.setValue(this.form_group.controls.images.value[0]);
    }

    onPreviousStep() {
        console.log(`stepOne ${this.stepOne}`);
        console.log(`stepTwo ${this.stepTwo}`);
        console.log(`stepThree ${this.stepThree}`);
        window.scroll(0, 0);
        if (this.stepTwo === true) {
            this.stepTwo = false;
            this.stepOne = true;
        } else if (this.stepThree === true) {
            this.stepTwo = true;
            this.stepThree = false;
        }
    }

    onNextStep() {
        this.stepTwo = false;
        this.stepThree = true;
    }

    displayErrorForm() {
        this.productAdd = true;
        this.productPreview = false;
        if (this.form_group.controls.images.errors !== null ||
            this.form_group.controls.title.errors !== null ||
            this.form_group.controls.customer_ref_number.errors !== null ||
            this.form_group.controls.description.errors !== null ||
            this.form_group.controls.country_of_origin.errors !== null ||
            this.form_group.controls.sales_identity.errors !== null ||
            this.form_group.controls.destination.errors !== null ||
            this.form_group.controls.showroom.errors !== null) {
            this.stepOne = true;
            this.stepTwo = false;
            this.stepThree = false;

        } else if (this.form_group.controls.gender.errors !== null ||
            this.form_group.controls.style.errors !== null ||
            this.form_group.controls.color.errors !== null ||
            this.form_group.controls.brand.errors !== null ||
            this.form_group.controls.is_collection.errors !== null ||
            this.form_group.controls.saleType.errors !== null ||
            this.form_group.controls.sizes.errors !== null ||
            this.form_group.controls.prepacks.errors !== null ||
            this.checkArrayforError(this.form_group.controls.prepacks, 'sizes') ||
            this.checkArrayforError(this.form_group.controls.prepacks, 'name') ||
            this.checkArrayforError(this.form_group.controls.prepacks, 'available_quantity') ||
            this.form_group.controls.price.errors !== null ||
            this.form_group.controls.minimal_price.errors !== null ||
            this.form_group.controls.currency.errors !== null ||
            this.form_group.controls.collection_shipping_date.errors !== null ||
            this.form_group.controls.recommended_retail_price.errors !== null ||
            this.form_group.controls.discount_price.errors !== null ||
            this.form_group.controls.discount_end_date.errors !== null ||
            this.form_group.errors !== null) {
            this.stepTwo = true;
            this.stepOne = false;
            this.stepThree = false;
        } else {
            this.stepTwo = false;
            this.stepOne = false;
            this.stepThree = true;
        }
        window.scroll(0, 0);
    }
    checkArrayforError(arr, name) {
        for (let i = 0; i < arr.length; i++) {
            if (arr.controls[i].controls[`${name}`].errors !== null) {
                return true;
            }
        }
        return false;
    }

    addProductStep() {
        if (this.model.recommended_retail_price) {
            this.form_group.controls['recommended_retail_price'].setValidators([CustomValidator.isPositive]);
            this.form_group.controls['recommended_retail_price'].updateValueAndValidity();
        }
        if (this.model.discount_price) {
            this.form_group.controls['discount_price'].setValidators([CustomValidator.isPositive]);
            this.form_group.controls['discount_price'].updateValueAndValidity();
            this.form_group.get('discount_end_date').setValidators(Validators.required);
            this.form_group.get('discount_end_date').updateValueAndValidity();
        } else {
            this.form_group.controls['discount_price'].clearValidators();
            this.form_group.controls['discount_price'].updateValueAndValidity();
            this.form_group.get('discount_end_date').clearValidators();
            this.form_group.get('discount_end_date').updateValueAndValidity();
        }
        if (this.model.minimal_price) {
            this.form_group.get('minimal_price').setValidators(CustomValidator.isPositive);
            this.form_group.get('minimal_price').updateValueAndValidity();
        }
        if (!this.form_group.controls.images.value.length) {
            this.form_group.controls['images'].setErrors({'required': true});
        } else {
            this.model.default_image = this.form_group.controls.images.value[0];
        }
        if (!this.form_group.valid) {
            new FormService().markTouched(this.form_group);
            this.displayErrorForm();
            return;
        } else {
            new FormService().markTouched(this.form_group);
            this.displayErrorForm();
        }

        this.productInfoAdd.title = this.model.title;
        if (this.model.description) {
            this.productInfoAdd.description = this.model.description;
        }
        if(this.model.destination) {
            if(this.model.destination.id === this.destinations[0].id)
                this.productInfoAdd.showroom_id = this.model.showroom.id;
            else if(this.model.destination.id === this.destinations[2].id)
                this.productInfoAdd.is_hidden = true;
        }
        this.productInfoAdd.country_of_origin = this.model.country_of_origin.id;
        this.productInfoAdd.sales_identity = this.model.sales_identity;
        this.productInfoAdd.price = this.model.price;
        if (this.model.minimal_price) {
            this.productInfoAdd.minimal_price = this.model.minimal_price;
        }
        this.productInfoAdd.currency = this.model.currency.id;
        this.productInfoAdd.default_image = this.model.default_image;
        this.productInfoAdd.images = this.model.images;
        this.productInfoAdd.composition_upper = this.model.composition_upper.id;
        this.productInfoAdd.composition_lining = this.model.composition_lining.id;
        this.productInfoAdd.composition_sock = this.model.composition_sock.id;
        this.productInfoAdd.composition_outer_sole = this.model.composition_outer_sole.id;

        if (this.model.color) {
            this.productInfoAdd.color_id = this.model.color.id;
        }
        this.productInfoAdd.gender = this.model.gender.id;
        if (this.model.style) {
            this.productInfoAdd.style = this.model.style.id;
        }
        if (this.model.brand) {
            this.productInfoAdd.brand = this.model.brand;
        }
        if (this.model.saleType === 'sizes') {
            if (this.model.sizes) {
                let sizes = Object.assign({}, this.model.sizes);
                Object.keys(sizes).forEach((key) => (sizes[key] == 0) && delete sizes[key]);
                this.productInfoAdd.sizes = sizes;
            }
        } else {
            if (this.model.saleType === 'prepacks') {
                for (let i = 0; i < this.form_group.controls.prepacks.value.length; i++) {
                        let sizes = Object.assign({}, this.form_group.controls.prepacks.value[i].sizes);
                        Object.keys(sizes).forEach((key) => {
                            if (sizes[key] === '' || +sizes[key] === 0) {
                                delete sizes[key]
                            }
                        })
                        this.model.prepacks[i].sizes = sizes;
                }
                this.productInfoAdd.prepacks = this.model.prepacks;
            }

        }
        if (this.model.sub_title) {
            this.productInfoAdd.sub_title = this.model.sub_title;
        }
        if (this.model.article_number) {
            this.productInfoAdd.article_number = this.model.article_number;
        }
        if (this.model.customer_ref_number) {
            this.productInfoAdd.customer_ref_number = this.model.customer_ref_number;
        }
        // this.productInfoAdd.tariff_code = this.model.tariff_code;
        this.productInfoAdd.recommended_retail_price = this.model.recommended_retail_price;
        if (this.model.packing_type) {
            this.productInfoAdd.packing_type = this.model.packing_type.id;
        }
        this.productInfoAdd.is_bidding_allowed = this.model.price_type.value;
        this.productInfoAdd.is_collection = this.model.is_collection.value;
        if (this.model.is_collection.value) {
            this.form_group.controls.collection_shipping_date.markAsTouched();
            this.productInfoAdd.collection_shipping_date = this.model.collection_shipping_date;
        }
        if (this.model.discount_price) {
            this.productInfoAdd.discount_price = this.model.discount_price;
            this.form_group.setControl('has_discount', new FormControl(true));
            this.productInfoAdd.has_discount = this.form_group.controls.has_discount.value;
            this.productInfoAdd.discount_end_date = this.model.discount_end_date;
        }
        if (this.form_group.controls.tags.value.length) {
            this.productInfoAdd.tags = this.form_group.controls.tags.value.trim();
            this.productInfoAdd.tags = this.productInfoAdd.tags.split(/[ ,]+/);
        }
        if (this.model.sub_title) {
            this.productInfoAdd.sub_title = this.model.sub_title;
        }
        if(this.showroomId) {
            this.productInfoAdd.showroom_id = this.showroomId;
        }
        this.isLoading = true;
        setTimeout(() => {
            this.form_group.disable();
        }, 0);
        console.log(this.productInfoAdd)

        this.productsService.addProduct(this.userService.getCurrentUserToken(), this.productInfoAdd)
            .subscribe(
                data => {
                    console.log(data);
                    this.isLoading = false;
                    if(!this.disableShowroom) {
                        this.modalService.open("custom-modal-2");
                    } else if(this.disableShowroom) {
                        this.sendProduct.emit(data['id']);
                        this.createNew.emit(false);
                        if(this.showroomId) {
                            this.router.navigate(['/dashboard/seller/showroom/edit/' + this.showroomId]);
                        } else {
                            this.router.navigate(['/dashboard/seller/showrooms/add']);
                        }
                    }

                },
                error => {
                    this.form_group.enable();
                    console.log(this.model)
                    this.isLoading = false;
                    console.log("Error add");
                    this.alertService.errorRegistration(error, this.form_group);
                    this.displayErrorForm();
                    if (this.model.saleType === 'sizes') {
                        this.form_group.controls['prepacks'].setErrors(null);
                    }
                });
    }
    private getName(control: AbstractControl): string | null {
        let group = <FormGroup> control.parent;

        if (!group) {
            return null;
        }

        let name: string;

        Object.keys(group.controls).forEach(key => {
            let childControl = group.get(key);

            if (childControl !== control) {
                return;
            }

            name = key;
        });

        return name;
    }
    addDraft() {
        if (this.model.discount_price) {
            this.form_group.controls['discount_price'].setValidators([CustomValidator.isPositive]);
            this.form_group.controls['discount_price'].updateValueAndValidity();
            this.form_group.get('discount_end_date').setValidators(Validators.required);
            this.form_group.get('discount_end_date').updateValueAndValidity();
            if (!this.form_group.get('discount_end_date').valid) {
                (<any> Object).values(this.form_group.controls).forEach(control => {
                    const name = this.getName(control);
                    if (name === 'discount_end_date') {
                        control.markAsTouched();
                        control.pristine = false;
                        this.stepTwo = true;
                        this.stepOne = false;
                        this.stepThree = false;
                    }
                });
                return;
            }
        } else {
            this.form_group.controls['discount_price'].clearValidators();
            this.form_group.controls['discount_price'].updateValueAndValidity();
            this.form_group.get('discount_end_date').clearValidators();
            this.form_group.get('discount_end_date').updateValueAndValidity();
        }
        if (this.model.images.length) {
            this.model.default_image = this.form_group.controls.images.value[0];
        }

        if (this.model.title) {
            this.productInfoAdd.title = this.model.title;
        }
        if (this.model.description) {
            this.productInfoAdd.description = this.model.description;
        }
        if (this.model.country_of_origin) {
            this.productInfoAdd.country_of_origin = this.model.country_of_origin.id;
        }
        if (this.model.sales_identity) {
            this.productInfoAdd.sales_identity = this.model.sales_identity;
        }
        if (this.model.price) {
            this.productInfoAdd.price = this.model.price;
        }
        if (this.model.minimal_price) {
            this.productInfoAdd.minimal_price = this.model.minimal_price;
        }
        if (this.model.currency) {
            this.productInfoAdd.currency = this.model.currency.id;
        }
        if (this.model.default_image) {
            this.productInfoAdd.default_image = this.model.default_image;
        }
        if (this.model.images) {
            this.productInfoAdd.images = this.model.images;
        }
        if (this.model.color) {
            this.productInfoAdd.color_id = this.model.color.id;
        }
        if (this.model.gender) {
            this.productInfoAdd.gender = this.model.gender.id;
        }
        if (this.model.style) {
            this.productInfoAdd.style = this.model.style.id;
        }
        if (this.model.brand) {
            this.productInfoAdd.brand = this.model.brand;
        }
        
        if(this.model.composition_upper !== null && this.model.composition_upper.id > -1)
            this.productInfoAdd.composition_upper = this.model.composition_upper.id;
        if(this.model.composition_lining !== null && this.model.composition_lining.id > -1)
            this.productInfoAdd.composition_lining = this.model.composition_lining.id;
        if(this.model.composition_sock !== null && this.model.composition_sock.id > -1)
            this.productInfoAdd.composition_sock = this.model.composition_sock.id;
        if(this.model.composition_outer_sole !== null && this.model.composition_outer_sole.id > -1)
            this.productInfoAdd.composition_outer_sole = this.model.composition_outer_sole.id;

        if (this.model.saleType === 'sizes') {
            if (this.model.sizes) {
                let sizes = Object.assign({}, this.model.sizes);
                Object.keys(sizes).forEach((key) => (sizes[key] == 0) && delete sizes[key]);
                this.productInfoAdd.sizes = sizes;
            }
        } else {
            if (this.model.saleType === 'prepacks') {
                for (let i = 0; i < this.form_group.controls.prepacks.value.length; i++) {
                    let sizes = Object.assign({}, this.form_group.controls.prepacks.value[i].sizes);
                    Object.keys(sizes).forEach((key) => {
                        if (sizes[key] === '') {
                            delete sizes[key]
                        }
                    })
                    this.model.prepacks[i].sizes = sizes;
                }
                this.productInfoAdd.prepacks = this.model.prepacks;
            }

        }
        if (this.model.sub_title) {
            this.productInfoAdd.sub_title = this.model.sub_title;
        }
        if (this.model.article_number) {
            this.productInfoAdd.article_number = this.model.article_number;
        }
        if (this.model.customer_ref_number) {
            this.productInfoAdd.customer_ref_number = this.model.customer_ref_number;
        }
        // this.productInfoAdd.tariff_code = this.model.tariff_code;
        if (this.model.recommended_retail_price) {
            this.productInfoAdd.recommended_retail_price = this.model.recommended_retail_price;
        }
        if (this.model.packing_type) {
            this.productInfoAdd.packing_type = this.model.packing_type.id;
        }
        if (this.model.is_bidding_allowed) {
            this.productInfoAdd.is_bidding_allowed = this.model.price_type.value;
        }
        if (this.model.is_collection) {
            this.productInfoAdd.is_collection = this.model.is_collection.value;
        }
        if (this.model.is_collection.value) {
            this.form_group.controls.collection_shipping_date.markAsTouched();
            this.productInfoAdd.collection_shipping_date = this.model.collection_shipping_date;
        }
        if (this.model.discount_price) {
            this.productInfoAdd.discount_price = this.model.discount_price;
            this.form_group.setControl('has_discount', new FormControl(true));
            this.productInfoAdd.has_discount = this.form_group.controls.has_discount.value;
            this.productInfoAdd.discount_end_date = this.model.discount_end_date;
        }
        if (this.form_group.controls.tags.value.length) {
            this.productInfoAdd.tags = this.form_group.controls.tags.value.trim();
            this.productInfoAdd.tags = this.productInfoAdd.tags.split(/[ ,]+/);
        }
        console.log(this.productInfoAdd);
        setTimeout(() => {
            this.form_group.disable();
        }, 0);
            this.productsService.addDraft(this.userService.getCurrentUserToken(), this.productInfoAdd)
                .subscribe(
                    data => {
                        this.modalService.open('custom-modal-3');
                    },
                    error => {
                        this.form_group.enable();
                        console.log('Error add draft');
                        console.log(error);
                        this.alertService.errorRegistration(error, this.form_group);
                        this.displayErrorForm();
                    });
    }

    previewProduct() {
        console.log(this.model);

        if(!this.form_group.valid) {
            this.form_group.markAsTouched();
            this.displayErrorForm();
            return;
        }

        if (this.model.discount_price) {
            this.form_group.setControl('has_discount', new FormControl(true));
            this.model.has_discount = this.form_group.controls.has_discount.value;
        }
        if (this.form_group.controls.tags.value.length) {
            this.model.tags = this.form_group.controls.tags.value.trim();
            this.model.tags =  this.model.tags.split(/[ ,]+/);
        }
        this.product = this.model;
        
        if(this.model.composition_upper !== null && this.model.composition_upper.id > -1)
            this.product.composition_upper = this.model.composition_upper.id;
        if(this.model.composition_lining !== null && this.model.composition_lining.id > -1)
            this.product.composition_lining = this.model.composition_lining.id;
        if(this.model.composition_sock !== null && this.model.composition_sock.id > -1)
            this.product.composition_sock = this.model.composition_sock.id;
        if(this.model.composition_outer_sole !== null && this.model.composition_outer_sole.id > -1)
            this.product.composition_outer_sole = this.model.composition_outer_sole.id;


        if (this.model.images.length && this.model.sales_identity) {
            this.productAdd = false;
            this.productPreview = true;
        }

    }

    closeModal(id: string) {
        this.modalService.close(id);
        this.router.navigate(['/dashboard/seller']);
    }

    closeModalDraft(id: string) {
        this.modalService.close(id);
        this.router.navigate(['/dashboard/seller']);
    }

    backClick() {
        this.productPreview = false;
        this.productAdd = true;
    }
    
    onOneOrMultipleChanged(event) {
        this.isAddingMultiple = event.value
    }

    onClickDownloadTemplate(event) {
        event.preventDefault()
        this.productsService.getGroupProductFile(this.userService.getCurrentUserToken()).subscribe(
        data => {
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                let url = URL.createObjectURL(file);
                a.href = url;
                a.download = 'shoonic_template.xlsx';
                a.click();
                window.URL.revokeObjectURL(url);
                a.parentNode.removeChild(a);
            },
        error => {
                console.log('Error downloading template');
                console.log(error);
                alert('Could not download the template. Please, try again after a while.')
            });
    }
    
    onChangeFileTemplateUpload(event) {
        this.fileNames = [];
        for(let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            this.fileNames.push(file.name);
            let fd = new FormData();
            fd.append('file', file);
            this.filesToUpload.push(fd);
        }
        this.uploadFiles();
        
    }

    uploadFiles() {
        this.errorCounter = 0;
        this.errorMsg = [];
        console.log(this.filesToUpload);
        console.log(this.filesUploaded);
        if(this.filesToUpload.length) {
        this.isTemplateUploading = true;
        for(let i = 0; i < this.filesToUpload.length; i++) {
            this.productsService.postGroupProductFile(this.filesToUpload[i], this.userService.getCurrentUserToken()).subscribe(
                data => {
                    console.log(data)
                    this.data = data;
                    if (data.id) {
                        this.filesUploaded++;
                    }
                    this.openModalWindow();
                }, error => {
                    this.filesUploaded++;
                    this.errorCounter++;
                    this.errorMsg.push(this.fileNames[i] + ': ' + error.error['file'][0]);
                    console.log('Error during template upload')
                    console.log(error)
                    this.openModalWindow();
                }
            )
        
        }
        console.log(this.filesUploaded);
    }
    }

    openModalWindow() {
        if(this.filesToUpload.length === this.filesUploaded) {
            this.areFilesUploaded = true;
            if(this.errorCounter === 0) {
                this.modalService.open('custom-modal-products-imported-ok')
            }
            else {
                this.modalService.open('custom-modal-products-imported-bad')
                this.isTemplateUploading = false;
                $('.add-multiple-holder input').val('');
                this.filesUploaded = 0;
                this.filesToUpload = [];
            }
        }
    }
}
