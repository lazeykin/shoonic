import {Component, OnInit, OnDestroy, Input, PLATFORM_ID} from '@angular/core';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize, NgxGalleryOrder} from 'ngx-gallery';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {ProductsService, UserService} from '../../_services/index';
import { ModalService } from '../../_services/index';
import {Location} from '@angular/common';
import {FormControl} from '@angular/forms';
import {SellerProductAddComponent} from './sellerProductAdd.component';
import {SellerEditComponent} from './sellerEdit.component';
import {LanguageService} from '../../_services/language.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-seller-preview',
    templateUrl: 'sellerPreviewProduct.component.html',
    styleUrls: ['sellerPreviewProduct.component.css']
})

export class SellerPreviewProductComponent implements OnInit {
    @Input() product;
    outputSizes: any;
    prepacks: any = [];
    singleImage: boolean = false;
    seeMoreDescr: boolean = false;
    genders: any = [];
    styles: any = [];
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
    gender: string;
    style: string;
    width: string;
    heel_height: string;
    country_of_origin: string;
    location_country: string;
    showroomId: string;
    currentDate: any;

    composition_inner: any = [];
    composition_outer: any = [];

    upper: any;
    lining: any;
    sock: any;
    outer_sole: any;

    showSizes: any = [];

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: ModalService,
        private userService: UserService,
        private productsService: ProductsService,
        private sellerProductAddComponent: SellerProductAddComponent,
        private  sellerEditComponent: SellerEditComponent,
        private languageService: LanguageService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }

    ngOnInit() {
        window.scroll(0,0);
        this.currentDate = new Date().getTime();
        this.showroomId = this.route.snapshot.queryParams.id;

        console.log(this.product);
        if (this.product.tags) {
            this.tags = this.product.tags;
            // this.tags = this.product.tags.replace(/\s+/g, '').split(',');
        }

        this.languageService.currentLanguage.subscribe(lang => {
            this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
                .subscribe(
                    data => {
                        this.productChoises = data;
                        console.log(this.productChoises)
                        this.genders = this.productChoises.gender;
                        this.styles = this.productChoises.style;
                        this.colors = this.productChoises.color;
                        this.packing_type = this.productChoises.packing_type;
                        this.widths = this.productChoises.width;
                        this.heels = this.productChoises.heel_height;
                        this.countries = this.productChoises.country;
                        this.composition_inner = this.productChoises.composition_upper_linning_sock;
                        this.composition_outer = this.productChoises.composition_Outer;
                        if (this.product.packing_type) {
                            this.packing_type = this.packing_type.find(x => x.id === this.product.packing_type.id);
                        }
                        this.gender = this.genders.find(x => x.id === this.product.gender);
                        this.style = this.styles.find(x => x.id === this.product.style);
                        this.country_of_origin = this.countries.find(x => x.id === this.product.country_of_origin.id);
                        this.location_country = this.countries.find(x => x.id === this.product.sales_identity.address.country);

                        this.upper = this.composition_inner.find(x => x.id === this.product.composition_upper);
                        this.lining = this.composition_inner.find(x => x.id === this.product.composition_lining);
                        this.sock = this.composition_inner.find(x => x.id === this.product.composition_sock);
                        this.outer_sole = this.composition_outer.find(x => x.id === this.product.composition_outer_sole);
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
            this.outputSizes = this.product.sizes;
        }

        if (this.product.prepacks) {
            this.prepacks = this.product.prepacks;
            for ( let i=0; i < this.prepacks.length; i++) {
                    this.prepacks[i].sizes = this.prepacks[i].sizes;
                    this.onSortSizes(this.prepacks[i].sizes)

            }
        }     

        this.galleryOptions = [
            {  width: '341px',height: '530px',
                imagePercent:100, "imageArrows": false,
                "imageSwipe": true, "thumbnailsArrows": false, "thumbnailsSwipe": true, imageSize: NgxGalleryImageSize.Contain,
                "previewSwipe": true, thumbnailSize: NgxGalleryImageSize.Contain,  "thumbnailsColumns": 4, "thumbnailsRows": 3, thumbnailsOrder: NgxGalleryOrder.Page  },
            { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
            { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
        ]

    }

    getMinSize(sizes) {
        if(Object.keys(sizes).length === 1) {
            return Number(Object.keys(sizes)[0]);
        }
        let arr = [];
        for (let i = 0; i < Object.keys(sizes).length; i++) {
            if(Object.values(sizes)[i]) {
                arr.push(Number(Object.keys(sizes)[i]))
            }
        }
        return Math.min(...arr);
    }

    getMaxSize(sizes) {
        if(Object.keys(sizes).length === 1) {
            return Number(Object.keys(sizes)[0]);
        }
        let arr = [];
        for (let i = 0; i < Object.keys(sizes).length; i++) {
            if(Object.values(sizes)[i]) {
                console.log('min: ', Object.keys(sizes)[i])
                arr.push(Number(Object.keys(sizes)[i]))
            }
        }
        return Math.max(...arr);
    }
    onSortSizes(sizes) {
        let sizesArr = [];
        for(let i = 0; i < Object.keys(sizes).length; i++) {
            sizesArr.push({
                key: Object.keys(sizes)[i].toString(),
                value: Object.values(sizes)[i]
            })
        }

        sizesArr = sizesArr.sort(function(a: any, b: any) {
            return (+a.key) - (+b.key);
        });
        let length = sizesArr.length;
        return sizesArr
    }
    closeModal(id: string){
        this.modalService.close(id);
        this.router.navigate(['/dashboard/seller']);
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
        if (this.router.url === '/dashboard/seller/product/add/steps') {
            this.sellerProductAddComponent.backClick();
        } else {
            this.sellerEditComponent.backClicked()
        }
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
            this.productInfoAdd.description = this.product.description;
            this.productInfoAdd.country_of_origin = this.product.country_of_origin.id;
            this.productInfoAdd.sales_identity = this.product.sales_identity;
            this.productInfoAdd.price = this.product.price;
            this.productInfoAdd.currency = this.product.currency.id;
            this.productInfoAdd.default_image = this.product.default_image;
            this.productInfoAdd.images = this.product.images;
            this.productInfoAdd.color_id = this.product.color.id;
            this.productInfoAdd.gender = this.product.gender.id;
            this.productInfoAdd.style = this.product.style.id;
            this.productInfoAdd.brand = this.product.brand;

            if (this.product.composition_upper !== null && this.product.composition_upper > -1)
                this.productInfoAdd.composition_upper = this.product.composition_upper;
            if (this.product.composition_lining !== null && this.product.composition_lining > -1)
                this.productInfoAdd.composition_lining = this.product.composition_lining;
            if (this.product.composition_sock !== null && this.product.composition_sock > -1)
                this.productInfoAdd.composition_sock = this.product.composition_sock;
            if (this.product.composition_outer_sole !== null && this.product.composition_outer_sole > -1)
                this.productInfoAdd.composition_outer_sole = this.product.composition_outer_sole;
            if (this.product.sizes) {
                this.productInfoAdd.sizes = this.product.sizes;
            } else {
                let product = JSON.parse(localStorage.getItem('productPreview'));
                this.productInfoAdd.prepacks = product.prepacks;
            }
            if (this.product.sub_title) {
                this.productInfoAdd.sub_title = this.product.sub_title;
            }
            this.productInfoAdd.customer_ref_number = this.product.customer_ref_number;
            // this.productInfoAdd.tariff_code = this.product.tariff_code;
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

            this.productsService.addProduct(this.userService.getCurrentUserToken(), this.productInfoAdd)
                .subscribe(
                    data => {
                        this.modalService.open("custom-modal-2");
                        localStorage.removeItem('productStep');
                        localStorage.removeItem('productPreview');
                    },
                    error => {
                        console.log('Error add');
                        console.log(error);
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
            this.productInfoAdd.color_id = this.product.color.id;
            this.productInfoAdd.gender = this.product.gender.id;
            this.productInfoAdd.style = this.product.style.id;
            this.productInfoAdd.brand = this.product.brand;

            if (this.product.composition_upper !== null && this.product.composition_upper > -1)
                this.productInfoAdd.composition_upper = this.product.composition_upper;
            if (this.product.composition_lining !== null && this.product.composition_lining > -1)
                this.productInfoAdd.composition_lining = this.product.composition_lining;
            if (this.product.composition_sock !== null && this.product.composition_sock > -1)
                this.productInfoAdd.composition_sock = this.product.composition_sock;
            if (this.product.composition_outer_sole !== null && this.product.composition_outer_sole > -1)
                this.productInfoAdd.composition_outer_sole = this.product.composition_outer_sole;
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
            // this.productInfoAdd.tariff_code = this.product.tariff_code;
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
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
    onDueTime(date) {
        return new Date(date).getTime()
    }

     totalPairs(prepack) {

        let sizesArr = [];
        for(let i = 0; i < Object.keys(prepack.sizes).length; i++) {
            sizesArr.push({
                key: Object.keys(prepack.sizes)[i].toString(),
                value: Object.values(prepack.sizes)[i]
            })
        }
        let sizes = sizesArr.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
        let totalQuantity = sumValues(sizes);
        return totalQuantity;
    }

}
