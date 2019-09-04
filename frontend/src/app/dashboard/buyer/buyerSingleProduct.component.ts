import {Component, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize, NgxGalleryOrder} from 'ngx-gallery';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, ProductsService, UserService} from '../../_services/index';
import {ModalService} from '../../_services/index';
import {Location} from '@angular/common';
import { DatePipe } from '@angular/common';
import {LanguageService} from '../../_services/language.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'app-buyer-single',
    templateUrl: 'buyerSingleProduct.component.html',
    styleUrls: ['buyerSingleProduct.component.css']
})

export class BuyerSingleProductComponent implements OnInit {
    @Input() shop = false;
    outputSizes: any;
    unique: any = [];
    edit: any = [];
    orderQuantity: number;
    originalInfo: any;
    finalProducts: any = [];
    prepacks: any;
    productId: any;
    displayErorQuantity: boolean = false;
    displayErorPrepackQuantity: boolean = false;
    total_price_with_discount: number;
    displaySizes: boolean = false;
    singleImage: boolean = false;
    displayPrepacks: boolean = false;
    product: any;
    total_price: number = 0;
    seeMoreDescr: boolean = false;
    sizes: number;
    pairs: number = 0;
    Onepairs: number = 0;
    genders: any = [];
    styles: any = [];
    colors: any;
    discountPrice = '0%';
    currencies: any;
    productChoises: any;
    countries: any;
    widths: any = [];
    heels: any = [];
    conditions: any = [];
    prepacksQuantity: any = [];
    sellers: any = [];
    seller: string;
    images: any = [];
    cartInfo: any = [];
    items: any = [];
    addItimes: any = {};
    discount: any = [];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
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
    showroom_id: any;
    showroomBidding = false;
    currentDate: any;
    errorMesage: any;
    isLoading:boolean = false;
    Number = Number;
    showSizes: any = [];
    isHovering: any = [];
    errorQuantity: any =[];
    errorQuantityMes  = false;
    errorPrepackQuantity: any = [];
    hasShop = false;
    scope: string;
    errorMinPrice = false;
    biddingPrice: any;
    disableAddCart: boolean = false;
    newDiscount: any;
    isNanDiscount = false;
    Object = Object;
    composition_inner: any = [];
    composition_outer: any = [];
    imageUrls: any = [];
    upper: any;
    lining: any;
    sock: any;
    outer_sole: any;
    innerWidth: number;
    createdOrderId: number;


    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        public router: Router,
        private location: Location,
        public modalService: ModalService,
        private productsService: ProductsService,
        private datePipe: DatePipe,
        private userService: UserService,
        private alertService: AlertService,
        private languageService: LanguageService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }
    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }
    ngOnInit() {
        this.innerWidth = window.innerWidth;
        const user = this.userService.getCurrentUser();
        if (user) {
            this.scope = user.scope[0];
        } else {
            this.scope = 'notRegistered';
        }
        window.scroll(0, 0);
        this.currentDate = new Date().getTime();
        this.product = '';
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('updateCart');
            this.updateCartInfo = JSON.parse(localStorage.getItem('updateCart'));
        }
        this.productId = this.route.snapshot.paramMap.get('id');
        this.languageService.currentLanguage.subscribe(lang => {
        if (this.scope !== 'notRegistered') {
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
                                if (this.product.webshop_url) {
                                    this.hasShop = true;
                                }
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
                                    this._setupSmallImages(this.product.images);
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
                                this.product.price = (+this.product.price).toFixed(2);
                                this.product.minimal_price = (+this.product.minimal_price).toFixed(2);
                                this.biddingPrice = (+this.product.price).toFixed(2);
                                this.biddingPrice = `${this.biddingPrice} ${this.product.currency}`;
                                this.newDiscount = parseFloat(this.biddingPrice).toFixed(2);

                                if (this.product.sizes) {
                                    this.displaySizes = true;
                                    this.outputSizes = Object.entries(this.product.sizes).map(([key, value]) => ({key, value}));
                                    this.outputSizes = this.outputSizes.sort(function (a: any, b: any) {
                                        return (+a.key) - (+b.key);
                                    });
                                    console.log(this.outputSizes);
                                    if (this.updateCartInfo) {
                                        this.updateCartInfo.size_quantities = Object.entries(this.updateCartInfo.size_quantities)
                                            .map(([key, quantity]) => ({key, quantity}));
                                        for (let i = 0; i < this.outputSizes.length; i++) {
                                            if (this.outputSizes[i].key === this.updateCartInfo.size_quantities[i].key) {
                                                this.outputSizes[i].quantity = this.updateCartInfo.size_quantities[i].quantity;
                                                this.errorQuantity[i] = false;
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
        } else {
                this.productsService.productChoisesVisitor(lang)
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

                            this.productsService.getProductForVisitor(this.productId).subscribe(response => {
                                this.product = response;
                                console.log(this.product);
                                if (this.product.webshop_url) {
                                    this.hasShop = true;
                                }
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
                                    this._setupSmallImages(this.product.images);
                                }

                                if (this.productChoises && this.product) {
                                    this.packing_type = this.packing_type.find(x => x.id === this.product.packing_type);
                                    this.gender = this.genders.find(x => x.id === this.product.gender);
                                    console.log(this.gender);
                                    this.style = this.styles.find(x => x.id === this.product.style);
                                    this.country_of_origin = this.countries.find(x => x.id === this.product.country_of_origin);
                                    this.location_country = this.countries.find(x => x.id === this.product.sales_identity.address.country);
                                }

                                this.upper = this.composition_inner.find(x => x.id === this.product.composition_upper);
                                this.lining = this.composition_inner.find(x => x.id === this.product.composition_lining);
                                this.sock = this.composition_inner.find(x => x.id === this.product.composition_sock);
                                this.outer_sole = this.composition_outer.find(x => x.id === this.product.composition_outer_sole);
                                this.product.price = (+this.product.price).toFixed(2);
                                this.product.minimal_price = (+this.product.minimal_price).toFixed(2);
                                this.biddingPrice = (+this.product.price).toFixed(2);
                                this.biddingPrice = `${this.biddingPrice} ${this.product.currency}`;
                                this.newDiscount = parseFloat(this.biddingPrice).toFixed(2);

                                if (this.product.sizes) {
                                    this.displaySizes = true;
                                    this.outputSizes = Object.entries(this.product.sizes).map(([key, value]) => ({key, value}));
                                    this.outputSizes = this.outputSizes.sort(function (a: any, b: any) {
                                        return (+a.key) - (+b.key);
                                    });
                                    console.log(this.outputSizes);
                                    if (this.updateCartInfo) {
                                        this.updateCartInfo.size_quantities = Object.entries(this.updateCartInfo.size_quantities)
                                            .map(([key, quantity]) => ({key, quantity}));
                                        for (let i = 0; i < this.outputSizes.length; i++) {
                                            if (this.outputSizes[i].key === this.updateCartInfo.size_quantities[i].key) {
                                                this.outputSizes[i].quantity = this.updateCartInfo.size_quantities[i].quantity;
                                                this.errorQuantity[i] = false;
                                            }
                                        }
                                    }
                                }

                                if (this.product.prepacks) {
                                    this.prepackLength = this.product.prepacks.length;
                                    this.prepacks = this.product.prepacks;
                                    for (let i = 0; i < this.prepacks.length; i++) {
                                        this.prepacks[i].sizes = Object.entries(this.prepacks[i].sizes).map(([key, value]) => ({key, value}));
                                    }
                                }
                            });

                        },
                        error => {
                            console.log('Error data');
                            console.log(error);
                        });

            }
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
       let length = sizes.length;
        return sizes
    }
    onOpenBidModal() {
        if (this.scope === 'seller') {
            return
        }
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-register');
            return
        }
        this.total_price = 0;
        this.pairs = 0;
        this.sizes = 0;
        this.items = [];
        this.addItimes = {};
        let pairsArr = []
        let totalQuantity = null;
        if (this.product.sizes) {
            let finalSizes = JSON.parse(JSON.stringify(this.outputSizes));
            let finalQuantity = finalSizes.filter(x => {
                if (x.quantity) {
                    return true;
                }
            }).filter(x => {
                if ( x.quantity !== '0') {
                    return true;
                }
            }).filter(x => {
                delete x.value;
                return x;
            });
            this.sizes = (Object.keys(finalQuantity)).length;
            let sizes = finalQuantity.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});
            for (let el in sizes) {
                if (sizes.hasOwnProperty(el)) {
                    this.pairs += parseFloat(sizes[el]);
                }
            }
            if (Object.keys(sizes).length === 0) {
                this.displayErorQuantity = true;
                this.disableAddCart = false;
                return
            } else if (Object.keys(sizes).length > 0) {
                this.displayErorQuantity = false;
                const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                totalQuantity = sumValues(sizes);
                let total_price = this.product.price * totalQuantity;
                this.items.push({
                    'product': this.product,
                    'product_id': this.product.id,
                    'size_quantities': sizes,
                    'total_price': total_price,
                    'total_price_with_discount': total_price
                });
            }
        } else {
            if (this.prepacksQuantity.length === 0) {
                this.displayErorPrepackQuantity = true;
            } else {
                this.displayErorPrepackQuantity = false;
                for (let i = 0; i < this.prepacksQuantity.length; i++) {
                    if (this.prepacksQuantity[i]) {
                        let sizes = this.prepacks[i].sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                        this.sizes = (Object.keys(sizes)).length;
                        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                        totalQuantity = sumValues(sizes);
                        this.Onepairs = totalQuantity * this.prepacksQuantity[i];
                        pairsArr.push(this.Onepairs)
                        let total_price = this.product.price * totalQuantity * this.prepacksQuantity[i];
                        this.items.push({
                            'product': this.product,
                            'product_id': this.product.id,
                            'prepack_id': this.prepacks[i].id,
                            'prepack': this.prepacks[i],
                            'quantity': this.prepacksQuantity[i],
                            'total_price': total_price,
                            'total_price_with_discount': total_price
                        });
                    }
                }
            }
        }
        if ((!this.displayErorPrepackQuantity) && (!this.displayErorQuantity)) {
            this.modalService.close('modal_selection')
            this.modalService.open('custom-modal-9');
        }
        this.addItimes.items = this.items;
        let discount = parseInt(this.discountPrice, 10);
        console.log(this.addItimes);
        for (let i = 0; i < this.addItimes.items.length; i++) {
            this.total_price += this.addItimes.items[i].total_price;
        }
        if (this.product.prepacks) {
           this.pairs = pairsArr.reduce((acc, curr) => acc + curr);
        }
    }

    onPlaceABid() {
        this.createdOrderId = null;
        console.log(this.total_price_with_discount / this.pairs);
        console.log(this.pairs);
        if ((!this.displayErorPrepackQuantity) && (!this.displayErorQuantity)) {
            this.isLoading = true;
            this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
                data => {
                    this.cartInfo = data;
                    if (this.cartInfo.length === 0) {
                        this.isLoading = true;
                        this.productsService.createNewCart(this.userService.getCurrentUserToken(), this.addItimes).subscribe(
                            data => {
                                this.cartInfoData = data;
                                console.log(this.cartInfoData)
                                const arrIds = [];
                                for ( let i = 0; i < this.cartInfoData.items.length; i++) {
                                    arrIds.push(this.cartInfoData.items[i].id)
                                }
                                this.productsService.createOrder(this.userService.getCurrentUserToken(),
                                    {'item_ids': arrIds}).subscribe(response => {
                                    this.createdOrderId = response['dialog_id'];
                                    console.log(response);
                                    this.modalService.close('custom-modal-9')
                                    this.modalService.open('custom-modal-bid')
                                    this.biddingPrice = (+this.product.price).toFixed(2);
                                    this.biddingPrice = `${this.biddingPrice} ${this.product.currency}`;
                                    this.isLoading = false;
                                }, error => {
                                    this.isLoading = false;
                                    console.log(error);
                                });
                                this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                                if (this.product.sizes) {
                                    this.outputSizes.forEach(function (item) {
                                        item.quantity = '';
                                    });
                                } else {
                                    this.prepacksQuantity = [];
                                }
                                this.isLoading = false;
                            },
                            error => {
                                console.log(error);
                                this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                                this.modalService.open('custom-modal-products-imported-bad');
                                this.isLoading = false;
                            });
                    } else {
                        this.isLoading = true;
                        this.productsService.addItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, this.addItimes).subscribe(
                            data => {
                                
                                this.cartInfoData = data;
                                console.log(this.cartInfoData)
                                let arr = [];
                                arr = this.cartInfoData.items.slice( -this.addItimes.items.length);
                                const arrIds = []
                                 for (let i = 0; i < arr.length; i++) {
                                     arrIds.push(arr[i].id)
                                 }
                                this.productsService.createOrder(this.userService.getCurrentUserToken(),
                                    {
                                        'item_ids': arrIds
                                    }).subscribe(response => {
                                    this.createdOrderId = response['dialog_id'];
                                    console.log(response);
                                    this.modalService.close('custom-modal-9')
                                    this.modalService.open('custom-modal-bid')
                                    this.biddingPrice = (+this.product.price).toFixed(2);
                                    this.biddingPrice = `${this.biddingPrice} ${this.product.currency}`;
                                    this.isLoading = false;
                                }, error => {
                                    console.log(error);
                                    this.isLoading = false;
                                });
                                this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                                if (this.product.sizes) {
                                    this.outputSizes.forEach(function (item) {
                                        item.quantity = '';
                                    });
                                } else {
                                    this.prepacksQuantity = [];
                                }
                            },
                            error => {
                                console.log(error);
                                this.isLoading = false;
                                this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                                this.modalService.open('custom-modal-products-imported-bad')
                            });
                    }
                },
                error => {
                    console.log(error);
                    this.isLoading = false;
                }
            );
        }

    }


    addtoCart() {
        if (this.scope === 'seller') {
            return
        }
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-register');
            return
        }

        this.items = [];
        this.addItimes = {};
        let totalQuantity = null;
        this.disableAddCart = true;
        console.log(this.outputSizes)
        if (this.product.sizes) {
            let finalSizes = JSON.parse(JSON.stringify(this.outputSizes));
            let finalQuantity = finalSizes.filter(x => {
                if (x.quantity) {
                    return true;
                }
            }).filter(x => {
                if ( +x.quantity !== 0) {
                    return true;
                }
            }).filter(x => {
                delete x.value;
                return x;
            });
            let sizes = finalQuantity.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});
            console.log(sizes);
            if (Object.keys(sizes).length === 0 ||
                Object.keys(sizes).reduce((sum,key) => sum + parseFloat(sizes[key] || 0),0) === 0) {
                this.displayErorQuantity = true;
                this.disableAddCart = false;
                return
            } else if (Object.keys(sizes).length > 0) {
                this.displayErorQuantity = false;
                const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                let sizesToCount = JSON.parse(JSON.stringify(sizes));
                totalQuantity = sumValues(sizesToCount);
                let total_price = this.product.price * totalQuantity;
                this.items.push({
                    'product': this.product,
                    'product_id': this.product.id,
                    'size_quantities': sizes,
                    'total_price': total_price,
                    'total_price_with_discount': total_price
                });
            }
        } else {
            if (this.prepacksQuantity.length === 0 || !Object.values(this.prepacksQuantity).length) {
                this.displayErorPrepackQuantity = true;
            } else {
                this.displayErorPrepackQuantity = false;
                for (let i = 0; i < this.prepacksQuantity.length; i++) {
                    if (this.prepacksQuantity[i]) {
                        let sizes = this.prepacks[i].sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                        totalQuantity = sumValues(sizes);
                        let total_price = this.product.price * totalQuantity;
                        this.items.push({
                            'product': this.product,
                            'product_id': this.product.id,
                            'prepack_id': this.prepacks[i].id,
                            'prepack': this.prepacks[i],
                            'quantity': this.prepacksQuantity[i],
                            'total_price': total_price,
                            'total_price_with_discount': total_price
                        });
                    }
                }
            }
        }
        this.addItimes.items = this.items;
        console.log(this.addItimes);

        if ((!this.displayErorPrepackQuantity) && (!this.displayErorQuantity)) {
            this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
                data => {
                    this.cartInfo = data;
                    console.log(this.cartInfo);
                    if (this.cartInfo.length === 0) {
                        this.productsService.createNewCart(this.userService.getCurrentUserToken(), this.addItimes).subscribe(
                            data => {
                                this.cartInfoData = data;
                                this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                                if (this.innerWidth <= 480) {
                                    this.modalService.close('modal_selection');
                                }
                                this.modalService.open('modal-add-to-cart');
                                this.disableAddCart = false;
                                if (this.product.sizes) {
                                    this.outputSizes.forEach(function (item) {
                                        item.quantity = '';
                                    });
                                } else {
                                    this.prepacksQuantity = [];
                                }
                            },
                            error => {
                                this.disableAddCart = false;
                                console.log(error);
                                this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                                this.modalService.open('custom-modal-products-imported-bad')
                            });
                    } else {
                        this.productsService.addItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, this.addItimes).subscribe(
                            data => {
                                this.cartInfoData = data;
                                this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                                if (this.innerWidth <= 480) {
                                    this.modalService.close('modal_selection');
                                }
                                this.modalService.open('modal-add-to-cart');
                                this.disableAddCart = false;
                                if (this.product.sizes) {
                                    this.outputSizes.forEach(function (item) {
                                        item.quantity = '';
                                    });
                                } else {
                                    this.prepacksQuantity = [];
                                }
                            },
                            error => {
                                this.disableAddCart = false;
                                console.log(error);
                                this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                                this.modalService.open('custom-modal-products-imported-bad')
                            });
                    }
                },
                error => {
                    this.disableAddCart = false;
                    console.log(error);
                }
            );
        }
        else {
            this.disableAddCart = false;
        }
    }

    openCartModal() {
        this.modalService.open('modal-add-to-cart');
    }
    onChangeDiscount() {
        this.newDiscount = parseFloat(this.biddingPrice).toFixed(2);
        const newPrice = parseFloat(this.newDiscount);
        if ( newPrice < 0 || newPrice > parseFloat(this.product.price)) {
            this.biddingPrice = `${this.product.price} ${this.product.currency}`;
        }
        if (isNaN(newPrice)) {
            this.isNanDiscount = true;
        } else {
            this.isNanDiscount = false;
        }
        if (this.addItimes.items.length > 1) {
            for ( let i = 0; i < this.addItimes.items.length; i++) {
                this.addItimes.items[i].bidding_price = newPrice;
            }
        } else {
            this.addItimes.items[0].bidding_price = newPrice;
        }
        this.total_price_with_discount = this.addItimes.items[0].bidding_price * this.pairs;
        if (this.total_price_with_discount / this.pairs < this.product.minimal_price) {
            this.errorMinPrice = true;
        } else {
            this.errorMinPrice = false;
        }
    }

    onDiscountPlus() {

        let discount = parseInt(this.discountPrice, 10);
        let count: number;
        if (discount > 95) {
            count = discount + (100 - discount)
        } else {
            count = discount + 5;
        }
        this.discountPrice = `${count}%`;
        if (this.addItimes.items.length > 1) {
            for ( let i = 0; i < this.addItimes.items.length; i++) {
                this.addItimes.items[i].bidding_discount_percent = count;
            }
        } else {
            this.addItimes.items[0].bidding_discount_percent = count;
        }
        this.total_price_with_discount = this.total_price - (this.total_price * count) / 100;
        if (this.total_price_with_discount / this.pairs < this.product.minimal_price) {
            this.errorMinPrice = true;
        } else {
            this.errorMinPrice = false;
        }
    }

    onDiscountMinus() {
        let discount = parseInt(this.discountPrice, 10);
        let count: number;
        if (discount < 5) {
            count = discount - discount;
        } else {
            count = discount - 5;
        }

        this.discountPrice = `${count}%`;
        if (this.addItimes.items.length > 1) {
            for ( let i = 0; i < this.addItimes.items.length; i++) {
                this.addItimes.items[i].bidding_discount_percent = count;
            }
        } else {
            this.addItimes.items[0].bidding_discount_percent = count;
        }
        this.total_price_with_discount = this.total_price - (this.total_price * count) / 100;
        if (this.total_price_with_discount / this.pairs < this.product.minimal_price) {
            this.errorMinPrice = true;
        } else {
            this.errorMinPrice = false;
        }
    }

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
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
    _setupSmallImages(data) {
        for (let i = 0; i < data.length; i++) {
            this.imageUrls.push({
                url: data[i].thumbnail_200 || data[i].url,
                href: data[i].thumbnail_200 || data[i].url
            });
        }
    }

    onRequestSampleClick() {
        if (this.scope === 'buyer') {
            this.productsService.requestSample(this.userService.getCurrentUserToken(), this.productId).subscribe(
                (data: any) => {
                    console.log('onRequestSampleClick data');
                    this.router.navigate(['/dashboard/messenger/products/dialog', data.id]);
                },
                error => {
                    console.log(error);
                });
        }
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-register');
            return
        }
    }

    onContactClick() {
        if (this.scope === 'buyer') {
            this.productsService.contactUs(this.userService.getCurrentUserToken(), this.productId).subscribe(
                (data: any) => {
                    console.log('onContactClick data');
                    this.router.navigate(['/dashboard/messenger/products/dialog', data.id]);
                },
                error => {
                    console.log(error);
                });
        }
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-register');
            return
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
    mouseHovering(i) {
        this.isHovering[i] = true;
    }
    mouseLeaving(i) {
        this.isHovering[i] = false;
    }

    goToCart() {
        this.router.navigate(['/dashboard/buyer/cart'])
    }
    onSizeChange(quantity, value, i) {
        console.log(`quantity - ${quantity}, value - ${value}`);
        if (+quantity > +value) {
            this.errorQuantity[i] = true;
        } else {
            this.errorQuantity[i] = false;
        }
       this.errorQuantityMes = !this.errorQuantity.every(elem => {
           return elem === false
       })
    }
    onCheckPrepackQuantity(input_quantity, available_quantity, i) {
        if (+input_quantity === 0) {
            this.prepacksQuantity.splice( i, 1, '');
        }
        // if (input_quantity === '') {
        //     this.prepacksQuantity.splice( i, 1);
        // }
        console.log(this.prepacksQuantity);
        console.log(this.addItimes);
        if (!available_quantity) {
            return
        }
        if (+input_quantity > +available_quantity) {
            this.errorPrepackQuantity[i] = true;
        } else {
            this.errorPrepackQuantity[i] = false;
        }
    }
    checkError(arr) {
        return arr.some(elem => {
           return elem === true
        })
    }
    toShop(product) {
        if (!product.webshop_url) {
            const url = this.router.createUrlTree(['dashboard/buyer'], {queryParams: { seller: this.product.company.id}});
            window.open(url.toString(), '_blank')
        }
        const url = this.router.createUrlTree(['', product.webshop_url]);
        window.open(url.toString(), '_blank');
    }

    getItemTotalPairs(item){
        let sum = 0
        if (item.size_quantities) {
            for (let key in item.size_quantities) {
                if (item.size_quantities.hasOwnProperty(key)) {
                    sum += parseInt(item.size_quantities[key])
                }
            }
        } else {
            let prepack_pairs = 0
            for (let key in item.prepack.sizes) {
                if (item.prepack.sizes.hasOwnProperty(key)) {
                    prepack_pairs += parseInt(item.prepack.sizes[key])
                }
            }
            sum += prepack_pairs * item.quantity
        }
        return sum;
    }
    
    getItemTotalSizes(item){
        let sizes = []
        if (item.size_quantities) {
            for (let key in item.size_quantities) {
                if (item.size_quantities.hasOwnProperty(key)) {
                    sizes.push(key)
                }
            }
        } else {
            let prepack_pairs = 0
            for (let key in item.prepack.sizes) {
                if (item.prepack.sizes.hasOwnProperty(key)) {
                    sizes.push(key)
                }
            }
        }
        let set = new Set(sizes);
        return set.size
    }

    getTotalPrice(items) {
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += items[i].total_price_with_discount;
        }
        return sum;
    }
    onOpenSelection() {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-register');
            return
        }
        this.modalService.open('modal_selection');
    }
}
