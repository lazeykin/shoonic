import { Component, OnInit, PLATFORM_ID } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize, NgxGalleryOrder } from 'ngx-gallery';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {ProductsService, UserService} from '../../../_services/index';
import { ModalService } from '../../../_services/index';
import {Location} from '@angular/common';
import { DatePipe } from '@angular/common';
import {LanguageService} from '../../../_services/language.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sellers-catalog-single-product',
  templateUrl: './sellers-catalog-single-product.component.html',
  styleUrls: ['./sellers-catalog-single-product.component.sass']
})
export class SellersCatalogSingleProductComponent implements OnInit {
    outputSizes: any;
    prepacks: any;
    productId : any;
    displayErorQuantity: boolean = false;
    displayErorPrepackQuantity: boolean = false;
    displaySizes: boolean = false;
    singleImage: boolean = false;
    displayPrepacks: boolean = false;
    product: any;
    seeMoreDescr: boolean = false;
    genders: any = [];
    styles: any = [];
    colors: any;
    currencies: any;
    productChoises: any;
    countries: any;
    widths: any = [];
    heels: any = [];
    conditions: any = [];
    prepacksQuantity: any = [];
    sellers: any;
    seller: string;
    images: any = [];
    cartInfo: any = [];
    items: any = [];
    addItimes: any = {};
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    type: string;
    packing_type: any;
    gender: string;
    style: string;
    width: string;
    heel_height: string;
    manufacture_country: string;
    location_country: string;
    updateCartInfo: any;
    cartInfoData: any = [];
    country_of_origin: any;
    prepackLength: number;
    bidding: boolean;
    tags: any;
    currentDate: any;

    composition_inner: any = [];
    composition_outer: any = [];

    upper: any;
    lining: any;
    sock: any;
    outer_sole: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: ModalService,
        private productsService: ProductsService,
        private datePipe: DatePipe,
        private userService: UserService,
        private languageService: LanguageService,
        @Inject(PLATFORM_ID) private platformId: any
    ) { }
    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            window.scroll(0, 0);
            this.currentDate = new Date().getTime();
            this.product = '';
            localStorage.removeItem('updateCart');
            this.updateCartInfo = JSON.parse(localStorage.getItem('updateCart'));
            this.productId = this.route.snapshot.paramMap.get('id');
            this.languageService.currentLanguage.subscribe(lang => {

                this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
                    .subscribe(
                        data => {
                            this.productChoises = data;
                            console.log(this.productChoises);
                            this.genders = this.productChoises.gender;
                            this.styles = this.productChoises.style;
                            this.colors = this.productChoises.color;
                            this.packing_type = this.productChoises.packing_type;
                            this.countries = this.productChoises.country;
                            this.composition_inner = this.productChoises.composition_upper_linning_sock;
                            this.composition_outer = this.productChoises.composition_Outer;

                            this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productId).subscribe(response => {
                                this.product = response;
                                this.bidding = this.product.is_bidding_allowed;
                                this.tags = this.product.tags;
                                this.seller = this.product.sales_identity.name;
                                console.log(this.product);
                                if (this.product.images.length === 0) {
                                    this.singleImage = true;
                                    this.product.images.push(this.product.default_image);
                                } else if ((this.product.images.length === 1) && (this.product.default_image)) {
                                    this.singleImage = true;
                                } else {
                                    this.singleImage = false;
                                    this._setupImages(this.product.images);
                                }

                                if (this.productChoises && this.product) {
                                    this.packing_type = this.packing_type.find(x => x.id === this.product.packing_type);
                                    this.gender = this.genders.find(x => x.id === this.product.gender);
                                    this.style = this.styles.find(x => x.id === this.product.style);
                                    this.country_of_origin = this.countries.find(x => x.id === this.product.country_of_origin);
                                    this.location_country = this.countries.find(x => x.id === this.product.sales_identity.address.country);
                                }

                                this.upper = this.composition_inner.find(x => x.id === this.product.composition_upper);
                                this.lining = this.composition_inner.find(x => x.id === this.product.composition_lining);
                                this.sock = this.composition_inner.find(x => x.id === this.product.composition_sock);
                                this.outer_sole = this.composition_outer.find(x => x.id === this.product.composition_outer_sole);

                                if (this.product.sizes) {
                                    this.displaySizes = true;
                                    this.outputSizes = Object.entries(this.product.sizes).map(([key, value]) => ({key, value}));

                                    if (this.updateCartInfo) {
                                        this.updateCartInfo.size_quantities = Object.entries(this.updateCartInfo.size_quantities)
                                            .map(([key, quantity]) => ({key, quantity}));
                                        for (let i = 0; i < this.outputSizes.length; i++) {
                                            if (this.outputSizes[i].key === this.updateCartInfo.size_quantities[i].key) {
                                                this.outputSizes[i].quantity = this.updateCartInfo.size_quantities[i].quantity;
                                            }
                                        }
                                    }
                                }

                                if (this.product.prepacks) {
                                    this.prepackLength = this.product.prepacks.length;
                                    this.prepacks = this.product.prepacks;
                                    for (let i = 0; i < this.prepacks.length; i++) {
                                        this.prepacks[i].sizes = Object.entries(this.prepacks[i].sizes).map(([key, value]) => ({
                                            key,
                                            value
                                        }));
                                    }
                                }
                            });

                        },
                        error => {
                            console.log('Error data');
                            console.log(error);
                        });
            })


            this.galleryImages = [];
            this.galleryOptions = [
                {
                    width: '341px',
                    height: '530px',
                    imagePercent: 100,
                    "imageArrows": false,
                    "imageSwipe": true,
                    "thumbnailsArrows": false,
                    "thumbnailsSwipe": true,
                    imageSize: NgxGalleryImageSize.Contain,
                    "previewSwipe": true,
                    thumbnailSize: NgxGalleryImageSize.Contain,
                    "thumbnailsColumns": 4,
                    "thumbnailsRows": 3,
                    thumbnailsOrder: NgxGalleryOrder.Page
                },
                {"breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3},
                {"breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2}
            ]
        }
    }



    _setupImages(data) {
        for (let i=0; i < data.length; i++) {
            this.galleryImages.push({
                small: data[i].url,
                medium: data[i].url,
                big: data[i].url,
            });
        }
    }




    closeModal(id: string) {
        this.modalService.close(id);
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
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
}
