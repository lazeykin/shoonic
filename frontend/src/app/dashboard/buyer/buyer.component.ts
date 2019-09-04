import { LanguageService } from './../../_services/language.service';
import { TranslatePipe } from './../../pipes/translate.pipe';
import {Component, OnInit, ViewChild, DoCheck, Input} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService} from '../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {PaginationChangedEvent} from '../../events';
import {PaginationComponent} from '../messenger/components/pagination/pagination.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-buyer-main',
    templateUrl: 'buyer.component.html',
    styleUrls: ['buyer.component.css']
})

export class BuyerComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    isLoading = false;
    @ViewChild(PaginationComponent) pagination;
    @Input() promo = false;
    products: any;
    productChoises: any;
    query: any;
    currentPage: number;
    totalItems: number;
    isFiltered: boolean;
    sellers: any;
    by_pairs: boolean = false;
    by_prepacks: boolean = false;
    noProducts: boolean = false;
    heels: any;
    sortBySelect: any;
    response: any;
    urlFilter: string = '';
    urlSort: string = '';
    filterArray: any = [];
    prepacksQuantity: any = [];
    modalProduct: any;
    displayErorQuantity: boolean = false;
    displayErorPrepackQuantity: boolean = false;
    items: any = [];
    addItimes: any = {};
    cartInfoData: any = [];
    cartInfo: any = [];
    totalSum: any = 0;
    sumSizes: any = 0;
    arr: any = [];
    currentDate: any;
    errorMesage: any;
    genders: any = [];
    styles: any = [];
    currencies: any = [];
    colors: any = [];
    packing_type: any = [];
    countries: any = [];
    viewAsSeller: any = false;
    currencyFilter: string = '';
    originCountryChange = '';
    errorPrepackQuantity: any = [];
    sellerCompanyId: string;

    sortValues: any = [
        {name: 'SORTBY_HIGH_PRICE', id: '-price'},
        {name: 'SORTBY_LOW_PRICE', id: 'price'},
        {name: 'SORTBY_NEWEST', id: '-date_published'},
        {name: 'SORTBY_OLDEST', id: 'date_published'},
        // {name: 'SORTBY_PROMO', id: '-date_published&has_discount=true'},
        // {name: 'SORTBY_WITHOUT', id: 'reset'}
    ];

    orderingValues: any = [
        {name: 'SORTBY_HIGH', id: '-rating'},
        {name: 'SORTBY_LOW', id: 'rating'}
    ];

    sortValuesTranslated: any = [];
    orderingValuesTranslated: any = [];
    isHovering: any = [];
    errorQuantity: any = [];
    errorQuantityMes = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        public modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private datePipe: DatePipe,
        private translatePipe: TranslatePipe,
        private langService: LanguageService,
        private alertService: AlertService,
        private userService: UserService) {
    }

    translateValues() {
        this.sortValuesTranslated = this.sortValues.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        this.orderingValuesTranslated = this.orderingValues.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })

        if(this.sortValuesTranslated.some(e => {return e.name == undefined}) || this.orderingValuesTranslated.some(e => {return e.name == undefined})) {
            setTimeout(this.translateValues.bind(this), 500);
        }
        else return this.sortValuesTranslated;
    }
    ngOnInit() {
        this.langService.currentLanguage.subscribe(lang => {
            setTimeout(this.translateValues.bind(this), 2000);
        })
        window.scroll(0, 0);
        this.sellerCompanyId = this.route.snapshot.queryParams.seller;
        this.urlSort = '&ordering=-date_published';
        this.currentDate = new Date().getTime();
        if (this.promo) {
            this.loadPages('&has_discount=true');
        } else {
            this.loadPages();
        }
        this.langService.currentLanguage.subscribe(lang => {
        this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
            .subscribe(
                data => {
                    this.productChoises = data;
                    this.genders = this.productChoises.gender;
                    this.styles = this.productChoises.style;
                    this.currencies = this.productChoises.currency;
                    this.colors = this.productChoises.color;
                    this.packing_type = this.productChoises.packing_type;
                    this.countries = this.productChoises.country;
                },
                error => {
                    console.log("Eror data");
                });
        });
    }

    compareProducts(a, b) {
        // Use toUpperCase() to ignore character casing
        const genreA = a.id;
        const genreB = b.id;

        let comparison = 0;
        if (genreA < genreB) {
            comparison = 1;
        } else if (genreA > genreB) {
            comparison = -1;
        }
        return comparison;
    }

    selectSortBy(filter) {
        this.urlSort = '';
        this.urlSort = filter;
        let arr = filter.split('=');
        let lastItem = arr[arr.length - 1];
        this.totalItems = 1;
        var query = `&limit=40&offset=0` + this.currencyFilter + this.originCountryChange + this.urlSort + this.urlFilter;
        if(this.viewAsSeller) {
            query += '&seller=me'
        }
        if (this.sellerCompanyId) {
            query += `&seller=${this.sellerCompanyId}`
        }
        if (this.promo) {
            query += '&has_discount=true';
        }
        if (lastItem === 'reset') {
            this.getProducts();
        } else {
            this.productsService.buyerFilterProducts(this.userService.getCurrentUserToken(), query).subscribe(response => {
                this.response = response;
                this.products = this.response.results;
                this.pagination.totalRows = this.response.count;
                this.pagination.currentPage = 1;
                if (this.products.length > 0) {
                    this.noProducts = false;
                } else {
                    this.noProducts = true;
                }
            });
        }
    }

    onFilterChenge(filter) {
        this.urlFilter = filter;
        var query = `&limit=40&offset=0` + this.currencyFilter + this.originCountryChange + this.urlFilter + this.urlSort;
        if(this.viewAsSeller) {
            query += '&seller=me'
        }
        if (this.sellerCompanyId) {
            query += `&seller=${this.sellerCompanyId}`
        }
        if (this.promo) {
            query += '&has_discount=true';
        }
        if (this.urlFilter) {
            this.productsService.buyerFilterProducts(this.userService.getCurrentUserToken(), query).subscribe(response => {
                this.response = response;
                this.pagination.totalRows = this.response.count;
                this.pagination.currentPage = 1;
                this.products = this.response.results;
                if (this.products.length > 0) {
                    this.noProducts = false;
                } else {
                    this.noProducts = true;
                }
            });
        } else {
            this.getProducts();
        }
    }
    onCurrencyChange(currency) {
        this.currencyFilter = `&currency=${currency.id}`;
        this.onFilterChenge(this.urlFilter);
    }
    onOriginCountryChange(country) {
        this.originCountryChange = `&country=${country.id}`;
        this.onFilterChenge(this.urlFilter);
    }
    onSortByChange(e) {
        this.selectSortBy(`&ordering=${e.id}`);
    }
    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }
    getProducts() {
        this.currentDate = new Date().getTime();
        //this.urlFilter = '&ordering=-date_published';
        let query = `&limit=40&offset=0` + this.currencyFilter + this.originCountryChange + this.urlSort + this.urlFilter;
        if(this.viewAsSeller) {
            query += '&seller=me'
        }
        if (this.sellerCompanyId) {
            query += `&seller=${this.sellerCompanyId}`
        }
        if (this.promo) {
            query += '&has_discount=true';
        }
        this.productsService.buyerProductsPage(this.userService.getCurrentUserToken(), query).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.pagination.currentPage = 1;
            this.products = this.response.results;
            if (this.products.length > 0) {
                this.noProducts = false;
            } else {
                this.noProducts = true;
            }
            // this.products.sort(this.compareProducts);
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].sizes) {
                    this.products[i].allSizes = Object.keys(this.products[i].sizes);
                } else if (this.products[i].prepacks) {
                    let array1 = [];
                    for (let j = 0; j < this.products[i].prepacks.length; j++) {
                        let allSizes = Object.keys(this.products[i].prepacks[j].sizes[0]);
                        array1 = array1.concat(allSizes);
                    }
                    this.products[i].allSizes = array1;
                }
            }

        });
    }

    productLink(id) {
        if(this.viewAsSeller) 
            this.router.navigate(['dashboard/seller/product/', id])
        else 
            this.router.navigate(['dashboard/buyer/product/', id]);
    }

    openModal(productId) {
        if(this.viewAsSeller)
            return
        this.displayErorQuantity = false;
        this.displayErorPrepackQuantity = false;
        this.productsService.getProduct(this.userService.getCurrentUserToken(), productId).subscribe(response => {
            this.modalProduct = response;
            console.log(this.modalProduct);
            this.modalService.open('custom-modal-product');
            if (this.modalProduct.sizes) {
                // this.displaySizes = true;
                this.modalProduct.sizes = Object.entries(this.modalProduct.sizes).map(([key, value]) => ({key, value}));
                this.modalProduct.sizes = this.modalProduct.sizes.sort(function(a: any, b: any) {
                    return (+a.key) - (+b.key);
                });
            }
            if (this.modalProduct.prepacks) {
                for (let i = 0; i < this.modalProduct.prepacks.length; i++) {
                    this.modalProduct.prepacks[i].sizes = Object.entries(this.modalProduct.prepacks[i].sizes).map(([key, value]) => ({
                        key,
                        value
                    }));
                }

            }
        });
    }

    closeModal(id: string) {
        this.modalProduct = '';
        this.totalSum = 0;
        this.displayErorQuantity = false;
        this.displayErorPrepackQuantity = false;
        this.modalService.close(id);
    }

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    addtoCart() {
        this.items = [];
        this.addItimes = {};
        let totalQuantity = null;
        if (this.modalProduct.sizes) {
            let finalSizes = JSON.parse(JSON.stringify(this.modalProduct.sizes));
            let finalQuantity = finalSizes.filter(x => {
                if (x.quantity) {
                    return true;
                }
            }).filter(x => {
                delete x.value;
                return x;
            });
            let sizes = finalQuantity.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});
            console.log(sizes);
            if (Object.keys(sizes).length === 0) {
                this.displayErorQuantity = true;
            } else if (Object.keys(sizes).length > 0) {
                this.displayErorQuantity = false;
                const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                totalQuantity = sumValues(sizes);
                let total_price = this.modalProduct.price * totalQuantity;
                this.items.push(
                    {
                        'product': this.modalProduct,
                        'product_id': this.modalProduct.id,
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
                        let sizes = this.modalProduct.prepacks[i].sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                        totalQuantity = sumValues(sizes);
                        let total_price = this.modalProduct.price * totalQuantity;
                        this.items.push(
                            {
                                'product': this.modalProduct,
                                'product_id': this.modalProduct.id,
                                'prepack_id': this.modalProduct.prepacks[i].id,
                                'prepack': this.modalProduct.prepacks[i],
                                'quantity': this.prepacksQuantity[i],
                                'total_price': total_price,
                                'total_price_with_discount': total_price
                            });
                    }
                }
            }
        }
        this.addItimes.items = this.items;
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
                                this.modalService.close('custom-modal-product');
                                this.modalService.open('custom-modal-3');
                                if (this.modalProduct.sizes) {
                                    this.modalProduct.sizes.forEach(function (item) {
                                        item.quantity = '';
                                    });
                                } else {
                                    this.prepacksQuantity = [];
                                }
                            },
                            error => {
                                console.log(error);
                                this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                                this.modalService.close('custom-modal-product');
                                this.modalService.open('custom-modal-products-imported-bad');
                            });
                    } else {
                        this.productsService.addItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, this.addItimes).subscribe(
                            data => {
                                this.cartInfoData = data;
                                this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                                this.modalService.close('custom-modal-product');
                                this.modalService.open('custom-modal-3');
                                if (this.modalProduct.sizes) {
                                    this.modalProduct.sizes.forEach(function (item) {
                                        item.quantity = '';
                                    });
                                } else {
                                    this.prepacksQuantity = [];
                                }
                            },
                            error => {
                                console.log(error);
                                this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                                this.modalService.close('custom-modal-product');
                                this.modalService.open('custom-modal-products-imported-bad')
                            });
                    }
                },
                error => {
                    console.log(error);
                }
            );
        }
    }

    onPageChanged(info: PaginationChangedEvent) {
        this.loadPages(this.currencyFilter + this.originCountryChange + this.urlFilter + this.urlSort, info.fetch, info.offset);
        window.scroll(0, 0);
    }

    loadPages(query: string = '', limit = null, offset = 0) {
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize;
        }
        console.log(limit);
        console.log(offset);
        query = `&limit=${limit}&offset=${offset}` + query;
        if (this.promo) {
            query += '&has_discount=true';
        }
        if(this.viewAsSeller)
            query += '&seller=me'
        if (this.sellerCompanyId) {
            query += `&seller=${this.sellerCompanyId}`
        }
        this.productsService.buyerProductsPage(this.userService.getCurrentUserToken(),
            query).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.products = this.response.results;
            if (this.products.length > 0) {
                this.noProducts = false;
            } else {
                this.noProducts = true;
            }

        });
    }

    onSumSizes(product, sum, prepack, pr_quaintity, index) {

        if (this.modalProduct.sizes) {
            this.sumSizes = 0;
            let sizes = sum.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});

            for (let i = 0; i < sum.length; i++) {
                if (sum[i].quantity !== undefined) {
                    this.sumSizes += Number(sum[i].quantity);
                }
            }
            if (this.modalProduct.has_discount && this.checkDiscountDate(this.modalProduct.discount_end_date)) {
                this.totalSum = (this.sumSizes * this.modalProduct.discount_price).toFixed(2);
            } else {
                this.totalSum = (this.sumSizes * this.modalProduct.price).toFixed(2);
            }

        } else {
            if (pr_quaintity !== '') {
                this.arr.push(pr_quaintity);
            }
            if (pr_quaintity === '') {
                if (index === 0) {
                    this.sumSizes = 0;

                } else {
                    const sizes = prepack.sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                    const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                    const totalQuantity = sumValues(sizes);
                    this.sumSizes = this.sumSizes - Number(totalQuantity) * Number(this.arr[index]);
                }
            }

            const sizes = prepack.sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
            const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
            let totalQuantity = sumValues(sizes);
            totalQuantity = Number(totalQuantity) * pr_quaintity;
            this.sumSizes += totalQuantity;
            if (this.modalProduct.has_discount && this.checkDiscountDate(this.modalProduct.discount_end_date)) {
                this.totalSum = (this.sumSizes * this.modalProduct.discount_price).toFixed(2);
            } else {
                this.totalSum = (this.sumSizes * this.modalProduct.price).toFixed(2);
            }
        }
    }
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
         return discountEndDate > this.currentDate;
    }
    reload() {
        location.reload();
    }
    mouseHovering(i) {
        this.isHovering[i] = true;
    }
    mouseLeaving(i) {
        this.isHovering[i] = false;
    }
    onSizeChange(quantity, value, i) {
        if (+quantity > +value) {
            this.errorQuantity[i] = true;
        } else {
            this.errorQuantity[i] = false;
        }
        console.log(this.errorQuantity);
        this.errorQuantityMes = !this.errorQuantity.every(elem => {
            return elem === false
        })
    }
    onCheckPrepackQuantity(input_quantity, available_quantity, i) {
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
}
