import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_models/index';
import {AlertService, ProductsService, UserService, ModalService} from '../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormImagesComponent} from '../../components/form/form-images/form-images.component';
import {AddEditProductTwoComponent} from '../../components/form/add-edit-product-two/add-edit-product-two.component';
import {FormService} from '../../_services/form';
import {CustomValidator} from '../../_services/custom_validators';
import {LanguageService} from '../../_services/language.service';

@Component({
    templateUrl: 'sellerEdit.component.html',
    styleUrls: ['sellerEdit.component.sass']
})

export class SellerEditComponent implements OnInit {
    @ViewChild('firstStep') firstStep;
    @ViewChild('secondStep') secondStep;
    @ViewChild('thirdStep') thirdStep;
    product: any = {};
    productPreview: boolean = false;
    productId: string;
    model: any = {};
    sales: any = [];
    finishPrepack: any = [];
    data: any = {};
    tagsInput: string;
    isLoading: boolean = false;
    Imagesmodel: any = {};
    currencies: any = [];
    countries: any = [];
    productInfoAdd: any = {};
    productChoises: any = {};
    prepackSelect: any = {};
    heel_heights: any = [];
    widths: any = [];
    showSizes = false;
    showPrepackSizes = false;
    conditions: any = [];
    saleType: string;
    emptyCustomPrepack: boolean = false;
    displayErorDuplicatePrepacks: boolean = false;
    displayErorDuplicateNamesPrepacks: boolean = false;
    customPrepackFinalSizes: any = [];
    showCustomPrepack: any = [];
    customPrepackName: any = [];
    enterPrepackName: any = [];
    enterPrepackSize: any = [];
    typePr: string = '';
    prepacksList: any = [];
    customPrepackSizes: any = [];
    emptyPrepack: boolean = false;
    displayErorQuantity: boolean = false;
    genders: any = [];
    styles: any = [];
    brands: any = [];
    outputSizes: any = [];
    packingType: any = [];
    sizes: any = {
        '39': '',
        '40': '',
        '41': '',
        '42': '',
        '43': '',
        '44': '',
        '45': '',
    };

    colors: any = [];
    prepacks: any = [];
    destinations: any = [];
    showrooms: any = [];
    showroomId: string;
    productEdit: boolean = true;
    draft: boolean;
    sub: any;

    composition_inner: any = [];
    composition_outer: any = [];

    form_group = new FormGroup({
        currency: new FormControl('', [<any>Validators.required]),
        default_image: new FormControl(''),
        description: new FormControl(''),
        images: new FormArray([], [<any>Validators.required]),
        country_of_origin: new FormControl('', [<any>Validators.required]),
        price: new FormControl('', [<any>Validators.required]),
        minimal_price: new FormControl(null),
        sales_identity: new FormControl('', [<any>Validators.required]),
        title: new FormControl('', [<any>Validators.required, Validators.maxLength(50)]),
        color: new FormControl(''),
        gender: new FormControl('', [<any>Validators.required]),
        style: new FormControl(''),
        brand: new FormControl(''),
        prepacks: new FormArray([]),
        sizes: new FormControl(null),
        saleType: new FormControl('', [<any>Validators.required]),
        is_collection: new FormControl(''),
        collection_shipping_date: new FormControl(''),
        packing_type: new FormControl(''),
        customer_ref_number: new FormControl('', [Validators.maxLength(30)]),
        price_type: new FormControl(''),
        size_type: new FormControl(''),
        recommended_retail_price: new FormControl(null),
        discount_price: new FormControl(''),
        discount_end_date: new FormControl(''),
        sub_title: new FormControl('', [<any>Validators.maxLength(100)]),
        tags: new FormControl('', [<any> CustomValidator.tags]),
        article_number: new FormControl('', [<any>Validators.maxLength(30)]),
        showroom_id: new FormControl(''),
        destination: new FormControl({value: '', disabled: true}),
        composition_upper: new FormControl(''),
        composition_sock: new FormControl(''),
        composition_lining: new FormControl(''),
        composition_outer_sole: new FormControl(''),
        is_hidden: new FormControl(null)
    }, [<any> CustomValidator.checkDiscount, <any> CustomValidator.checkMinimalPrice,
        <any> CustomValidator.checkForLessRecomenPrice, <any> CustomValidator.checkForLessPromoPrice]);


    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: ModalService,
        private alertService: AlertService,
        private userService: UserService,
        private langService: LanguageService) {
    }

    ngOnInit() {
        console.log(this.form_group);
        this.productId = this.route.snapshot.paramMap.get('id');
        this.product = '';
        this.form_group.valueChanges.subscribe(x => {
            this.model = Object.assign({}, x);
            if (this.model.discount_price === null) {
                this.form_group.controls['discount_price'].clearValidators();
                this.form_group.get('discount_end_date').clearValidators();
            }
            if (this.model.recommended_retail_price === null) {
                this.form_group.controls['recommended_retail_price'].clearValidators();
            }
            if (this.model.minimal_price === null) {
                this.form_group.controls['minimal_price'].clearValidators();
            }
            console.log('Main model changed');
            console.log(this.model);
        });

         this.sub = this.route.snapshot.paramMap.get('data');
         console.log(this.sub);
         if (this.sub === 'badPublish') {
             this.addProductStep();
         }

        this.showroomId = this.route.snapshot.queryParams.id;

        this.langService.currentLanguage.subscribe(lang => {
            this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
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

                        this.productsService.allSellerPrepacks(this.userService.getCurrentUserToken()).subscribe(response => {
                            this.prepacks = response;
                            this.prepacks.unshift({
                                id: 0,
                                name: 'Custom'
                            });
                            console.log('prepacks');
                            console.log(this.prepacks);
                        });

                        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productId).subscribe(response => {
                            console.log(response)
                            this.product = response;
                            this.product.date_published ? this.draft = false : this.draft = true;
                            console.log(this.product);
                            this.product.recommended_retail_price = (+this.product.recommended_retail_price).toFixed(2);
                            if (this.product.recommended_retail_price === '0.00') {
                                this.product.recommended_retail_price = null;
                            }
                            this.product.price = (+this.product.price).toFixed(2);
                            if (this.product.minimal_price) {
                                this.product.minimal_price = (+this.product.minimal_price).toFixed(2);
                            }
                            if (this.product.discount_price) {
                                this.product.discount_price = (+this.product.discount_price).toFixed(2);
                            }
                            this.model = this.product;
                            if (this.product.tags) {
                                this.product.tags = this.product.tags.join(',');
                            }
                            if (this.product.prepacks) {
                                console.log(this.product.prepacks);
                                for (let i = 0; i < this.product.prepacks.length; i++) {
                                    (<FormArray>this.form_group.get('prepacks')).push(
                                        new FormGroup({
                                            available_quantity: new FormControl(null, [CustomValidator.integer]),
                                            company_id: new FormControl(null),
                                            created_by_id: new FormControl(null),
                                            date_created: new FormControl(null),
                                            id: new FormControl(null),
                                            name: new FormControl('', [Validators.required]),
                                            sizes: new FormControl({}, [CustomValidator.checkSizes]),
                                            size_type: new FormControl(''),
                                            item: new FormControl(this.product.prepacks[i].name)
                                        })
                                    );
                                }
                            }
                            this.form_group.patchValue(this.product);
                            if (!this.product.is_collection) {
                                this.form_group.controls.is_collection.setValue({id: 1, value: false, name: 'Stock'});
                            } else {
                                this.form_group.controls.is_collection.setValue({id: 0, value: true, name: 'Collection'});
                            }
                            if (this.product.discount_price) {
                                this.form_group.setControl('has_discount', new FormControl(true));
                            }
                            if (!this.product.is_bidding_allowed) {
                                this.form_group.controls.price_type.setValue({id: 0, name: 'Fixed price', value: false});
                            } else {
                                this.form_group.controls.price_type.setValue({id: 1, name: 'Biding', value: true});
                            }
                            let images_ctl = this.form_group.controls.images as FormArray;
                            for (let image of this.product.images) {
                                images_ctl.push(new FormControl(image));
                            }
                            if (this.product.sizes) {
                                this.form_group.controls.saleType.setValue('sizes');
                            } else if (!this.product.sizes) {
                                this.form_group.controls.saleType.setValue('prepacks');
                            }

                        });
                    },
                    error => {
                        console.log('Eror data');
                    });
        });

        this.enterPrepackName[0] = false;
        this.enterPrepackSize[0] = false;

        this.productsService.allBrands(this.userService.getCurrentUserToken()).subscribe(response => {
            this.brands = response;
            this.brands.unshift({
                id: 0,
                name: 'Custom'
            })
        });

        this.productsService.allSI(this.userService.getCurrentUserToken()).subscribe(response => {
            this.sales = response;
            this.sales.unshift({
                id: 0,
                name: 'Custom'
            })
        });
    }


    compareTech(t1, t2): boolean {
        return t1 && t2 ? t1 === t2 : t1 === t2;
    }

    compareName(t1, t2): boolean {
        return t1 && t2 ? t1.name === t2.name : t1 === t2;
    }


    compareId(t1, t2): boolean {
        return t1 && t2 ? t1.id === t2.id : t1 === t2;
    }

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    selectPrepack(i) {
        // adding custom prepacks
        if (this.prepackSelect[i].id !== 0) {
            this.showCustomPrepack[i] = false;
            this.customPrepackName[i] = '';
            this.customPrepackSizes[i] = '';
        } else {
            this.showCustomPrepack[i] = true;
            this.customPrepackSizes[i] = Object.entries(this.sizes).map(([key, value]) => ({key, value}));
        }
    }

    removePrepack(index) {
        this.customPrepackSizes.splice(index, 1);
        this.customPrepackName.splice(index, 1);
        this.showCustomPrepack.splice(index, 1);
        this.prepackSelect.splice(index, 1);
        this.prepacksList.splice(index, 1);
    }

    addPrepack() {
        if (this.prepackSelect.length < this.prepacksList.length) {
            this.emptyPrepack = true;
        } else {
            this.emptyPrepack = false;
            for (let i = 0; i < this.showCustomPrepack.length; i++) {
                if (this.showCustomPrepack[i]) {
                    if (!this.customPrepackName[i]) {
                        this.enterPrepackName[i] = true;
                    } else {
                        this.enterPrepackName[i] = false;
                    }
                    if (this.customPrepackSizes[i]) {
                        let sizes = this.customPrepackSizes[i].reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                        Object.keys(sizes).forEach((key) => (sizes[key] == 0) && delete sizes[key]);
                        if (Object.keys(sizes).length === 0) {
                            this.enterPrepackSize[i] = true;
                        } else {
                            this.enterPrepackSize[i] = false;
                        }
                    }
                }
            }
            if (this.enterPrepackName.every(x => x === false) && (this.enterPrepackSize.every(x => x === false))) {
                this.prepacksList.push(this.prepacks);
            }
        }
    }

    displayErrorForm() {
        this.productEdit = true;
        this.productPreview = false;
        if (this.form_group.controls.images.errors !== null ||
            this.form_group.controls.title.errors !== null ||
            this.form_group.controls.customer_ref_number.errors !== null ||
            this.form_group.controls.description.errors !== null ||
            this.form_group.controls.country_of_origin.errors !== null ||
            this.form_group.controls.sales_identity.errors !== null) {
            this.firstStep.active = true;
            this.secondStep.active = false;
            this.thirdStep.active = false;


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
                this.firstStep.active = false;
                this.secondStep.active = true;
                this.thirdStep.active = false;
        } else if (this.form_group.controls.sub_title.errors !== null ||
            this.form_group.controls.tags.errors !== null ||
            this.form_group.controls.article_number.errors !== null ||
            this.form_group.controls.packing_type.errors !== null) {
                this.firstStep.active = false;
                this.secondStep.active = false;
                this.thirdStep.active = true;
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
        if (!this.product.date_published && !this.productPreview) {
            this.addDraft();
            return
        }
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
        if (this.form_group.controls.tags.value.length) {
            if (typeof(this.form_group.controls.tags.value) === 'string') {
                this.productInfoAdd.tags = this.form_group.controls.tags.value.trim();
                this.productInfoAdd.tags = this.productInfoAdd.tags.split(/[ ,]+/);
            } else {
                this.productInfoAdd.tags = this.form_group.controls.tags.value;
            }
        }

        if(this.model.composition_upper !== null && this.model.composition_upper.id > -1)
            this.productInfoAdd.composition_upper = this.model.composition_upper.id;
        if(this.model.composition_lining !== null && this.model.composition_lining.id > -1)
            this.productInfoAdd.composition_lining = this.model.composition_lining.id;
        if(this.model.composition_sock !== null && this.model.composition_sock.id > -1)
                this.productInfoAdd.composition_sock = this.model.composition_sock.id;
        if(this.model.composition_outer_sole !== null && this.model.composition_outer_sole.id > -1)
            this.productInfoAdd.composition_outer_sole = this.model.composition_outer_sole.id;

        this.productInfoAdd.title = this.model.title;
        if (this.model.description) {
            this.productInfoAdd.description = this.model.description;
        }
        if(this.showroomId) {
            this.productInfoAdd.showroom_id = this.showroomId;
        }

        if(this.model.showroom_id) {
            this.productInfoAdd.showroom_id = this.product.showroom_id
        }
        if(this.model.is_hidden) {
            this.productInfoAdd.is_hidden = true;
        }
        this.productInfoAdd.country_of_origin = this.model.country_of_origin.id;
        this.productInfoAdd.sales_identity = this.model.sales_identity;
        this.productInfoAdd.price = this.model.price;
        if (this.model.minimal_price) {
            this.productInfoAdd.minimal_price = this.model.minimal_price;
        }        this.productInfoAdd.currency = this.model.currency.id;
        this.productInfoAdd.default_image = this.model.images[0];
        this.productInfoAdd.images = this.model.images;
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
            this.productInfoAdd.collection_shipping_date = this.model.collection_shipping_date;
        }
        if (this.model.discount_price) {
            this.productInfoAdd.discount_price = this.model.discount_price;
            this.form_group.setControl('has_discount', new FormControl(true));
            this.productInfoAdd.has_discount = this.form_group.controls.has_discount.value;
            this.productInfoAdd.discount_end_date = this.model.discount_end_date;
        }
        if (this.model.sub_title) {
            this.productInfoAdd.sub_title = this.model.sub_title;
        }
        if (this.model.article_number) {
            this.productInfoAdd.article_number = this.model.article_number;
        }
        console.log(this.productInfoAdd);
        setTimeout(() => {
            this.form_group.disable();
        }, 0);
        this.productEdit = true;
        this.productPreview = false;
        this.isLoading = true;
        this.productsService.editProduct(this.userService.getCurrentUserToken(), this.productId, this.productInfoAdd)
            .subscribe(
                data => {
                    this.modalService.open('custom-modal-2');
                    this.isLoading = false;
                },
                error => {
                    this.form_group.enable();
                    this.isLoading = false;
                    this.form_group.controls.sizes.setValue(this.model.sizes);
                    this.form_group.controls.prepacks.setValue(this.model.prepacks);
                    console.log('Eror product edit');
                    this.alertService.errorProductEdit(error, this.form_group);
                    this.displayErrorForm();
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
                        this.productEdit = true;
                        this.productPreview = false;
                        this.firstStep.active = false;
                        this.secondStep.active = true;
                        this.thirdStep.active = false;
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

        if(this.model.composition_upper !== null && this.model.composition_upper.id > -1)
            this.productInfoAdd.composition_upper = this.model.composition_upper.id;
        if(this.model.composition_lining !== null && this.model.composition_lining.id > -1)
            this.productInfoAdd.composition_lining = this.model.composition_lining.id;
        if(this.model.composition_sock !== null && this.model.composition_sock.id > -1)
            this.productInfoAdd.composition_sock = this.model.composition_sock.id;
        if(this.model.composition_outer_sole !== null && this.model.composition_outer_sole.id > -1)
            this.productInfoAdd.composition_outer_sole = this.model.composition_outer_sole.id;

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
        if (this.productInfoAdd.images.length) {

            this.productsService.saveDraft(this.userService.getCurrentUserToken(), this.productId, this.productInfoAdd)
                .subscribe(
                    data => {
                        this.modalService.open('custom-modal-3');
                    },
                    error => {
                        console.log('Error add draft');
                        console.log(error);
                    });
        }

    }

    previewProduct() {
        console.log(this.model);
        if(!this.form_group.valid) {
            this.displayErrorForm();
            this.form_group.markAsTouched();
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
        this.product = Object.assign({}, this.model);

        if(this.model.composition_upper !== null && this.model.composition_upper.id > -1)
            this.product.composition_upper = this.model.composition_upper.id;
        if(this.model.composition_lining !== null && this.model.composition_lining.id > -1)
            this.product.composition_lining = this.model.composition_lining.id;
        if(this.model.composition_sock !== null && this.model.composition_sock.id > -1)
            this.product.composition_sock = this.model.composition_sock.id;
        if(this.model.composition_outer_sole !== null && this.model.composition_outer_sole.id > -1)
            this.product.composition_outer_sole = this.model.composition_outer_sole.id;

        if (this.model.images.length && this.model.sales_identity) {
            this.productEdit = false;
            this.productPreview = true;
        }

    }
    hasNoDuplicates(arr) {
        return arr.every(num => arr.indexOf(num) === arr.lastIndexOf(num));
    }


    closeModal(id: string) {
        this.modalService.close(id);
        if(this.showroomId) {
            this.router.navigate(['/dashboard/seller/showroom/', this.showroomId]);
        }
        else {
        this.router.navigate(['/dashboard/seller']);
        }
    }

    backClicked() {
        this.productPreview = false;
        this.productEdit = true;
    }
    
    backToCatalog() {
        this.location.back();
    }

    addPrepackSizes() {
        this.outputSizes.push({
            key: '', value: ''
        });
    }

    removePrepackSizes(index) {
        this.outputSizes.splice(index, 1);
    }

    addSizes() {
        this.outputSizes.push({
            key: '', value: ''
        });
    }

    removeSize(sizeNumber) {
        this.outputSizes.splice(sizeNumber, 1);
    }


    checkDuplicateInObject(propertyName, inputArray) {
        let seenDuplicate = false,
            testObject = {};

        inputArray.map(function (item) {
            let itemPropertyName = item[propertyName];
            if (itemPropertyName in testObject) {
                testObject[itemPropertyName].duplicate = true;
                item.duplicate = true;
                seenDuplicate = true;
            }
            else {
                testObject[itemPropertyName] = item;
                delete item.duplicate;
            }
        });

        return seenDuplicate;
    }


}
