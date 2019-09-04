import { Component, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {ProductsService, UserService} from '../../_services/index';
import { ModalService } from '../../_services/index';
import {Location} from '@angular/common';
import {FormControl} from '@angular/forms';
import {LanguageService} from '../../_services/language.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    templateUrl: 'sellerPreviewEditProduct.component.html',
    styleUrls: ['sellerPreviewEditProduct.component.css']
})

export class SellerPreviewEditProductComponent implements OnInit {
    outputSizes: any;
    prepacks: any = [];
    _prepacks: any = [];
    productId : any;
    displayPrepacks: boolean = false;
    singleImage: boolean = false;
    product: any;
    seeMoreDescr: boolean = false;
    categories: any = [];
    category: string;
    genders: any = [];
    styles: any = [];
    types: any = [];
    colors: any;
    currencies: any;
    productChoises: any;
    countries: any;
    widths: any = [];
    heels: any = [];
    packing_type: any;
    tags: any = [];
    sellers: any;
    images: any = [];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    productInfoAdd: any = {};
    type: string;
    condition: string;
    gender: string;
    style: string;
    width: string;
    token: string;
    heel_height: string;
    country_of_origin: string;
    location_country: string;
    dataCompany: any;
    showroomId: string;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: ModalService,
        private userService: UserService,
        private productsService: ProductsService,
        private languageService: LanguageService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.showroomId = this.route.snapshot.queryParams.id;
            window.scroll(0, 0);
            this.product = JSON.parse(localStorage.getItem('productPreview'));
            this.productId = this.product.id;
            console.log(this.product);
            if (this.product.tags) {
                this.tags = this.product.tags;
                console.log(this.tags)
                // this.tags = this.product.tags.replace(/\s+/g, '').split(',');
            }
            this.languageService.currentLanguage.subscribe(lang => {
                this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
                    .subscribe(
                        data => {
                            this.productChoises = data;
                            console.log(this.productChoises)
                            this.categories = this.productChoises.category;
                            this.genders = this.productChoises.gender;
                            this.styles = this.productChoises.style;
                            this.types = this.productChoises.type;
                            this.colors = this.productChoises.color;
                            this.packing_type = this.productChoises.packing_type;
                            this.widths = this.productChoises.width;
                            this.heels = this.productChoises.heel_height;
                            this.countries = this.productChoises.country;

                            this.category = this.categories.find(x => x.id === this.product.category);
                            this.type = this.types.find(x => x.id === this.product.type);
                            this.packing_type = this.types.find(x => x.id === this.product.packing_type.id);
                            this.gender = this.genders.find(x => x.id === this.product.gender);
                            this.style = this.styles.find(x => x.id === this.product.style);
                            this.country_of_origin = this.countries.find(x => x.id === this.product.country_of_origin.id);
                            this.location_country = this.countries.find(x => x.id === this.product.sales_identity.address.country);
                        },
                        error => {
                            console.log("Eror data");
                        });
            });
            if (this.product.images.length === 0) {
                this.singleImage = true;
                this.product.images.push(this.product.default_image);
            } else if ((this.product.images.length === 1) && (this.product.default_image)) {
                this.singleImage = true;
            } else {
                this.singleImage = false;
                this._setupImages(this.product.images);
            }

            if (this.product.sizes) {
                this.outputSizes = Object.entries(this.product.sizes).map(([key, value]) => ({key, value}));
            }

            if (this.product.prepacks) {
                this.prepacks = this.product.prepacks;
                for (let i = 0; i < this.prepacks.length; i++) {
                    this.prepacks[i].sizes = Object.entries(this.prepacks[i].sizes).map(([key, value]) => ({key, value}));
                }
            }


            this.galleryOptions = [
                {
                    width: '100%',
                    height: '500px',
                    imageAnimation: NgxGalleryAnimation.Slide
                },
                // max-width 800
                {
                    breakpoint: 800,
                    width: '100%',
                    height: '500px',
                    imagePercent: 80,
                    thumbnailsPercent: 20,
                    thumbnailsMargin: 20,
                    thumbnailMargin: 20
                },
                // max-width 400
                {
                    breakpoint: 400,
                    preview: false
                }
            ];
        }

    }

    closeModal(id: string){
        this.modalService.close(id);
        if(this.showroomId) {
            this.router.navigate(['/dashboard/seller/showroom/'+this.showroomId]);
        }
        else {
            this.router.navigate(['/dashboard/seller']);
        }
    }

    _setupImages(data) {
        this.galleryImages = [];
        for (let i=0; i < data.length; i++) {

            this.galleryImages.push({
                small: data[i].url,
                medium: data[i].url,
                big: data[i].url,
            });
        }
    }

    backClicked() {
        this.location.back();
    }

    seeMoreDesc() {
        this.seeMoreDescr = true;
    }

    seeLessDesc() {
        this.seeMoreDescr = false;
    }

    addFullProduct() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.showroomId) {
                this.productInfoAdd.showroom_id = this.showroomId;
            }
            if (this.product.tags) {
                this.productInfoAdd.tags = this.product.tags;
            }
            this.productInfoAdd.title = this.product.title;
            if (this.product.description) {
                this.productInfoAdd.description = this.product.description;
            }
            this.productInfoAdd.country_of_origin = this.product.country_of_origin.id;
            this.productInfoAdd.sales_identity = this.product.sales_identity;
            this.productInfoAdd.price = this.product.price;
            this.productInfoAdd.currency = this.product.currency.id;
            this.productInfoAdd.default_image = this.product.default_image;
            this.productInfoAdd.images = this.product.images;
            this.productInfoAdd.category = this.product.category.id;
            if (this.product.type) {
                this.productInfoAdd.type = this.product.type.id;
            }
            if (this.product.color) {
                this.productInfoAdd.color_id = this.product.color.id;
            }
            this.productInfoAdd.gender = this.product.gender.id;
            if (this.product.style) {
                this.productInfoAdd.style = this.product.style.id;
            }
            if (this.product.brand) {
                this.productInfoAdd.brand = this.product.brand;
            }
            if (this.product.sizes) {
                this.productInfoAdd.sizes = this.product.sizes;
            } else {
                let product = JSON.parse(localStorage.getItem('productPreview'));
                this.productInfoAdd.prepacks = product.prepacks;
                this.productInfoAdd.sizes = null;
            }
            if (this.product.sub_title) {
                this.productInfoAdd.sub_title = this.product.sub_title;
            }
            if (this.product.customer_ref_number) {
                this.productInfoAdd.customer_ref_number = this.product.customer_ref_number;
            }
            // this.productInfoAdd.tariff_code = this.model.tariff_code;
            this.productInfoAdd.recommended_retail_price = this.product.recommended_retail_price;
            this.productInfoAdd.packing_type = this.product.packing_type.id;
            this.productInfoAdd.is_bidding_allowed = this.product.price_type.value;
            this.productInfoAdd.is_collection = this.product.is_collection.value;
            if (this.product.is_collection.value) {
                this.productInfoAdd.collection_shipping_date = this.product.collection_shipping_date;
            }
            if (this.product.discount_price) {
                this.productInfoAdd.discount_price = this.product.discount_price;
                if (this.product.has_discount) {
                    this.productInfoAdd.has_discount = this.product.has_discount;
                }
                this.productInfoAdd.discount_end_date = this.product.discount_end_date;
            }
            if (this.product.article_number) {
                this.productInfoAdd.article_number = this.product.article_number;
            }
            console.log(this.productInfoAdd)

            this.productsService.editProduct(this.userService.getCurrentUserToken(), this.productId, this.productInfoAdd)
                .subscribe(
                    data => {
                        this.modalService.open("custom-modal-2");
                        localStorage.removeItem('productStep');
                        localStorage.removeItem('editPreview');
                    },
                    error => {
                        console.log("Error product edit");

                    });
        }
    }

    addDraft() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.product.tags) {
                this.productInfoAdd.tags = this.product.tags;
            }
            this.productInfoAdd.title = this.product.title;
            this.productInfoAdd.description = this.product.description;
            this.productInfoAdd.country_of_origin = this.product.country_of_origin.id;
            this.productInfoAdd.sales_identity = this.product.sales_identity;
            this.productInfoAdd.price = this.product.price;
            this.productInfoAdd.currency = this.product.currency.id;
            this.productInfoAdd.default_image = this.product.default_image;
            this.productInfoAdd.images = this.product.images;
            this.productInfoAdd.category = this.product.category.id;
            this.productInfoAdd.type = this.product.type.id;
            this.productInfoAdd.color_id = this.product.color.id;
            this.productInfoAdd.gender = this.product.gender.id;
            this.productInfoAdd.style = this.product.style.id;
            this.productInfoAdd.brand = this.product.brand;
            if (this.product.sizes) {
                this.productInfoAdd.sizes = this.product.sizes;
            } else {
                let test = JSON.parse(localStorage.getItem('productPreview'));
                console.log(test.prepacks)
                this.productInfoAdd.prepacks = test.prepacks;
            }
            if (this.product.sub_title) {
                this.productInfoAdd.sub_title = this.product.sub_title;
            }
            this.productInfoAdd.customer_ref_number = this.product.customer_ref_number;
            // this.productInfoAdd.tariff_code = this.model.tariff_code;
            this.productInfoAdd.recommended_retail_price = this.product.recommended_retail_price;
            this.productInfoAdd.packing_type = this.product.packing_type.id;
            this.productInfoAdd.is_bidding_allowed = this.product.price_type.value;
            this.productInfoAdd.is_collection = this.product.is_collection.value;
            if (this.product.is_collection.value) {
                this.productInfoAdd.collection_shipping_date = this.product.collection_shipping_date;
            }
            if (this.product.discount_price) {
                this.productInfoAdd.discount_price = this.product.discount_price;
                if (this.product.has_discount) {
                    this.productInfoAdd.has_discount = this.product.has_discount.value;
                }
                this.productInfoAdd.discount_end_date = this.product.discount_end_date;
            }
            if (this.product.article_number) {
                this.productInfoAdd.article_number = this.product.article_number;
            }


            this.productsService.addDraft(this.userService.getCurrentUserToken(), this.productInfoAdd)
                .subscribe(
                    data => {
                        this.modalService.open("custom-modal-3");
                        localStorage.removeItem('productStep');
                        localStorage.removeItem('productPreview');
                    },
                    error => {
                        console.log('Error add draft');
                        console.log(error);
                    });
        }
    }
}
