import {Component, OnInit} from '@angular/core';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize, NgxGalleryOrder} from 'ngx-gallery';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {ProductsService, UserService} from '../../_services/index';
import {ModalService} from '../../_services/index';
import {Location} from '@angular/common';
import {DatePipe} from '@angular/common';
import {LanguageService} from '../../_services/language.service';


@Component({
    templateUrl: 'sellerSingleProduct.component.html',
    styleUrls: ['sellerSingleProduct.component.css']
})

export class SellerSingleProductComponent implements OnInit {
    outputSizes: any;
    prepacks: any;
    productId: any;
    displayPrepacks: boolean = false;
    singleImage: boolean = false;
    product: any;
    seeMoreDescr: boolean = false;
    displayCart: boolean = false;
    genders: any = [];
    styles: any = [];
    colors: any;
    currencies: any;
    dataUser: any = {};
    productChoises: any;
    countries: any;
    packing_type: any = [];
    sellers: any;
    images: any = [];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    type: string;
    condition: string;
    gender: string;
    style: string;
    width: string;
    heel_height: string;
    country_of_origin: string;
    location_country: string;
    seller: string;
    currentDate: any;
    showSizes: any = [];

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
        private userService: UserService,
        private modalService: ModalService,
        private datePipe: DatePipe,
        private productsService: ProductsService,
        private languageService: LanguageService) {
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }

    ngOnInit() {
        window.scroll(0, 0);
        this.currentDate = new Date().getTime();
        this.product = '';
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
                            console.log(this.product);
                            this.seller = this.product.sales_identity.name;
                            if (this.product.images.length === 0) {
                                this.singleImage = true;
                                this.product.images.push(this.product.default_image);
                            } else if ((this.product.images.length === 1) && (this.product.default_image)) {
                                this.singleImage = true;
                            } else {
                                this.singleImage = false;
                                this._setupImages(this.product.images);
                            }

                            if (this.product.company.id != this.dataUser.company.id) {
                                this.displayCart = true;
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
                                this.outputSizes = Object.entries(this.product.sizes).map(([key, value]) => ({key, value}));
                                this.outputSizes = this.outputSizes.sort(function (a: any, b: any) {
                                    return (+a.key) - (+b.key);
                                });
                            }
                            if (this.product.prepacks) {
                                this.prepacks = this.product.prepacks;
                                for (let i = 0; i < this.prepacks.length; i++) {
                                    this.prepacks[i].sizes = Object.entries(this.prepacks[i].sizes).map(([key, value]) => ({key, value}));
                                }
                            }
                        });
                    },
                    error => {
                        console.log('Eror data');
                    });
        })
        this.userService.getPersonalInfo(this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.dataUser = data;

                },
                error => {
                    console.log(error);
                });


        this.galleryImages = [];
        this.galleryOptions = [
            {  width: '341px',height: '530px',
                imagePercent:100, "imageArrows": false,
                "imageSwipe": true, "thumbnailsArrows": false, "thumbnailsSwipe": true, imageSize: NgxGalleryImageSize.Contain,
                "previewSwipe": true, thumbnailSize: NgxGalleryImageSize.Contain,  "thumbnailsColumns": 4, "thumbnailsRows": 3, thumbnailsOrder: NgxGalleryOrder.Page  },
            { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
            { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
        ];
    }

    _setupImages(data) {
        for (let i = 0; i < data.length; i++) {
            this.galleryImages.push({
                small: data[i].thumbnail_200 || data[i].url,
                medium: data[i].thumbnail_500 || data[i].url,
                big: data[i].url,
            });
        }
    }

    productEditOne() {
        this.router.navigate(['dashboard/seller/product/edit/', this.productId]);
    }

    productArchive() {
        this.productsService.archiveProduct(this.userService.getCurrentUserToken(), this.productId).subscribe(
            data => {
                this.router.navigate(['dashboard/seller/archive']);
            },
            error => {
                console.log('Error archive');
            });
    }

    openModal() {
        this.modalService.open('custom-modal-2');
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
    totalPairs(prepack) {
        let sizes = prepack.sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
        let totalQuantity = sumValues(sizes);
        return totalQuantity;
    }
    onSortSizes(sizes) {
        sizes = sizes.sort(function(a: any, b: any) {
            return (+a.key) - (+b.key);
        });
        return sizes
    }
}
