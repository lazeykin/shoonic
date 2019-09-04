import {Component, OnInit, ViewChild, EventEmitter, Output, OnChanges, Input, PLATFORM_ID} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {trigger} from '@angular/animations';
import {LanguageService} from '../../../_services/language.service';
import {TranslatePipe} from '../../../pipes/translate.pipe';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css', './style-icons.sass']
})
export class FiltersComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    products: any;
    productChoises: any;
    genders: any;
    styles: any;
    colors: any;
    currencies: any;
    countries: any = [];
    countries_location: any = [];
    query: any;
    packing_type: any;
    sellers: any = [];
    by_pairs: boolean = false;
    by_prepacks: boolean = false;
    sale_by_type: any;
    noProducts: boolean = false;
    heels: any;
    sortBySelect: any;
    response: any;
    urlFilter: string;
    filterArray: any = [];
    sortValues: any = [];
    productSearch: any;
    totalItems: number;
    isFiltered: boolean = false;
    pageNumber: any;
    isSaleTypeSelected: boolean;
    price_types: any = [{id: 0, name: 'FILTER_FIXED_PRICE', value: false},
        {id: 1, name: 'FILTER_BIDDING', value: true}, {id: 2, name: 'FILTER_PROMOTIONS', value: false}];
    collectionOrStock: any = [{id: 0, value: true, name: 'FILTER_COLLECTION'},
        {id: 1, value: false, name: 'FILTER_STOCK'}];
    priceTypesTranslated: any = [];
    collectionOrStockTranslated: any = [];
    composition_inner_upper: any = [];
    composition_inner_lining: any = [];
    composition_inner_sock: any = [];
    composition_outer: any = [];

    brands: any = [];

    selectedFilters: any = [];

    country_search: string = '';
    country_location_search: string = '';
    sellers_search: string = '';
    brands_search: string = '';

    country_results: any = [];
    country_location_results: any = [];
    sellers_results: any = [];
    brands_results: any = [];

    url: string = '';

    @Output() passChange = new EventEmitter<string>();
    @Output() passNoProducts = new EventEmitter<boolean>();
    @Output() numberOfItems = new EventEmitter<number>();
    @Output() filters = new EventEmitter<boolean>();
    @Output() filter = new EventEmitter<string>();
    @Output() closeFilter = new EventEmitter();
    @Input() scope: string;
    @Input() shop: boolean = false;
    _sellerId: number = null;
    @Input() set sellerId(value: number) {
        this._sellerId = value;
        this.getFiltersItems();

    }

    scopeUser: string;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private alertService: AlertService,
        private userService: UserService,
        private languageService: LanguageService,
        private translatePipe: TranslatePipe,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }

    compare(a, b) {
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

    filterChange(value: string, isChecked: boolean, type: string, name: string) {
        console.log(type);
        let newUrl = this.router.url.replace(`?page=${this.pageNumber}`, '');
        this.isFiltered = true;
        let val = value;

        var filterProperty = this.getFilterProperty(type);
        if (isChecked) {
            if (type !== 'collection_or_stock' && type !== 'price_type') {
                this.filterArray.push({[type]: value});
                this.selectedFilters.push({
                    type: type,
                    name: name,
                    value: value
                });
            } else {
                if (type === 'price_type') {
                    if (value == '0') {
                        this.filterArray.push({'is_bidding_allowed': false});
                        this.price_types[1].selected = false;
                        this.filterArray = this.filterArray.filter(e => e['is_bidding_allowed'] !== true);
                        this.selectedFilters.push({
                            type: 'is_bidding_allowed',
                            name: name,
                            value: false
                        });
                        this.selectedFilters = this.selectedFilters.filter(e => !(e.type == 'is_bidding_allowed' && e.value == true));
                    } else if (value == '1') {
                        this.filterArray.push({'is_bidding_allowed': true});
                        this.filterArray = this.filterArray.filter(e => e['is_bidding_allowed'] !== false);
                        this.price_types[0].selected = false;
                        this.selectedFilters.push({
                            type: 'is_bidding_allowed',
                            name: name,
                            value: true
                        });
                        this.selectedFilters = this.selectedFilters.filter(e => !(e.type == 'is_bidding_allowed' && e.value == false));
                    } else {
                        this.filterArray.push({'has_discount': true});
                        this.selectedFilters.push({
                            type: 'has_discount',
                            name: name,
                            value: true
                        });
                    }
                } else if (type === 'collection_or_stock') {
                    if (value == '0') {
                        this.filterArray.push({'availability_type': 'collection'});
                        this.selectedFilters.push({
                            type: 'availability_type',
                            name: name,
                            value: 'collection'
                        });
                    } else if (value == '1') {
                        this.filterArray.push({'availability_type': 'in_stock'});
                        this.selectedFilters.push({
                            type: 'availability_type',
                            name: name,
                            value: 'in_stock'
                        });
                    } else {
                        this.urlFilter = '';
                    }
                }
            }
        } else {
            if (type !== 'collection_or_stock' && type !== 'price_type' && type !== 'availability_type' && type !== 'is_bidding_allowed'
                && type !== 'has_discount') {
                let _arrayByType = [];
                let _arrayWithoutType = [];
                _arrayByType = this.filterArray.filter(e => Object.keys(e)[0] === type);
                _arrayWithoutType = this.filterArray.filter(e => Object.keys(e)[0] !== type);
                _arrayByType = this.filterArray.filter(e => Object.keys(e)[0] === type);
                _arrayWithoutType = this.filterArray.filter(e => Object.keys(e)[0] !== type);
                _arrayByType = _arrayByType.filter(e => Object.values(e)[0] !== val);
                this.filterArray = [];
                this.filterArray = _arrayWithoutType.concat(_arrayByType);
                this.selectedFilters = this.selectedFilters.filter(obj => {
                    if (obj.type !== 'availability_type' && obj.type !== 'is_bidding_allowed' && obj.type !== 'has_discount') {
                        return true;
                    }
                    return false;
                });
                if (type === 'seller') {
                    filterProperty = filterProperty.filter(item => {
                        if (item.company && item.company.id === value) {
                            item.selected = false;
                        }
                        return true;
                    });
                }
            } else {
                let array = [];
                if (type === 'price_type' || type === 'is_bidding_allowed' || type === 'has_discount') {
                    if (value == '0' && type !== 'has_discount') {
                        this.filterArray = this.filterArray.filter(e => e['is_bidding_allowed'] !== false);
                        filterProperty = filterProperty.filter(item => {
                            if (item.name === name) {
                                item.selected = false;
                            }
                            return true;
                        });

                    } else if (value == '1' && type !== 'has_discount') {
                        this.filterArray = this.filterArray.filter(e => e['is_bidding_allowed'] !== true);
                        filterProperty = filterProperty.filter(item => {
                            if (item.name === name) {
                                item.selected = false;
                            }
                            return true;
                        });

                    } else if ((type == 'has_discount') || (type == 'price_type' && value == '2')) {
                        this.filterArray = this.filterArray.filter(e => Object.keys(e)[0] !== 'has_discount');
                        filterProperty = filterProperty.filter(item => {
                            if (item.name === name) {
                                item.selected = false;
                            }
                            return true;
                        });
                    }
                } else if (type === 'collection_or_stock' || type === 'availability_type') {
                    if (value == '0' || value == 'collection') {
                        this.filterArray = this.filterArray.filter(e => e['availability_type'] !== 'collection');
                        this.selectedFilters = this.selectedFilters.filter(obj => {
                            if (!(obj.type == 'collection_or_stock' && obj.value == 0)) {
                                return true;
                            }
                            return false;
                        });
                        filterProperty = filterProperty.filter(item => {
                            if (item.name === name) {
                                item.selected = false;
                            }
                            return true;
                        });
                    } else if (value == '1' || value == 'in_stock') {
                        this.filterArray = this.filterArray.filter(e => e['availability_type'] !== 'in_stock');
                        this.selectedFilters = this.selectedFilters.filter(obj => {
                            if (!(obj.type == 'collection_or_stock' && obj.value == 1)) {
                                return true;
                            }
                            return false;
                        });
                        filterProperty = filterProperty.filter(item => {
                            if (item.name === name) {
                                item.selected = false;
                            }
                            return true;
                        });
                    } else {
                        this.urlFilter = '';
                    }
                }
            }
            this.selectedFilters = this.selectedFilters.filter(obj => {
                if (obj.value !== value) {
                    return true;
                }
                return false;
            });

            filterProperty = filterProperty.filter(item => {
                if (item.id === value) {
                    item.selected = false;
                }
                return true;
            });

            if (type === 'sell_by_type' && value === 'by_pairs') {
                this.by_pairs = false;
            }
            if (type === 'sell_by_type' && value === 'by_prepacks') {
                this.by_prepacks = false;
            }

        }
        this.urlFilter = '';
        for (let i = 0; i < this.filterArray.length; i++) {
            this.urlFilter += '&' + Object.keys(this.filterArray[i]) + '=' + Object.values(this.filterArray[i]);
            console.log(this.urlFilter);
        }
        this.passToParent();
    }

    passToParent() {
        this.passChange.emit(this.products);
        this.passNoProducts.emit(this.noProducts);
        console.log(this.urlFilter);
        this.filter.emit(this.urlFilter);
    }

    onCloseFilterPanel() {
        this.clearFilter();
        this.closeFilter.emit();
    }

    checkSelected(type) {
        let filterProperty = [];
        let item;
        Object.assign(filterProperty, this[type]);
        item = filterProperty.find(type => {
            return type.selected;
        });
        if (item) {
            return true;
        }
        return false;
    }

    checkAllSelected() {
        if (this.urlFilter) {
            return true;
        }
        return false;

    }

    clearProrerty(type) {
        let filterProperty = this.getFilterProperty(type);
        filterProperty = filterProperty.filter(type => {
            type.selected = false;
            return true;
        });

        switch (type) {
            case 'brand':
                this.brands_search = '';
                this.brands_results = this.brands.map(a => ({...a}));
                break;
            case 'seller':
                this.sellers_search = '';
                this.sellers_results = this.sellers.map(a => ({...a}));
                break;
            case 'country_of_origin':
                this.country_search = '';
                this.country_results = this.countries.map(a => ({...a}));
                break;
            case 'country':
                this.country_location_search = '';
                this.country_location_results = this.countries_location.map(a => ({...a}));
                break;
            default:
                break;
        }

        this.filterArray = this.filterArray.filter(e => Object.keys(e)[0] !== type);
        if (type === 'price_type') {
            this.filterArray = this.filterArray.filter(e => Object.keys(e)[0] !== 'is_bidding_allowed');
            this.filterArray = this.filterArray.filter(e => Object.keys(e)[0] !== 'has_discount');
            this.selectedFilters = this.selectedFilters.filter(e => e.type !== 'is_bidding_allowed' && e.type !== 'has_discount');
        }
        if (type === 'availability' || type === 'availability_type') {
            this.filterArray = this.filterArray.filter(e => Object.keys(e)[0] !== 'availability_type');
            this.selectedFilters = this.selectedFilters.filter(obj => {
                if (obj.type !== 'availability_type') {
                    return true;
                }
                return false;
            });
        }
        if (type === 'sell_by_type') {
            this.by_pairs = false;
            this.by_prepacks = false;
        }
        this.selectedFilters = this.selectedFilters.filter(obj => {
            if (obj.type !== type) {
                return true;
            }
            return false;
        });
        this.urlFilter = '';
        console.log(this.filterArray);
        for (let i = 0; i < this.filterArray.length; i++) {
            this.urlFilter += '&' + Object.keys(this.filterArray[i]) + '=' + Object.values(this.filterArray[i]);
        }
        console.log(this.urlFilter);
        this.passToParent();

    }

    getFilterProperty(type) {
        let filterProperty = [];
        if (type === 'availability_type' || type === 'availability') {
            filterProperty = this.collectionOrStock;
        } else if (type === 'price_type' || type === 'is_bidding_allowed' || type === 'has_discount') {
            filterProperty = this.price_types;
        } else if (type === 'gender') {
            filterProperty = this.genders;
        } else if (type === 'style') {
            filterProperty = this.styles;
        } else if (type === 'gender') {
            filterProperty = this.genders;
        } else if (type === 'packing_type') {
            filterProperty = this.packing_type;
        } else if (type === 'color') {
            filterProperty = this.colors;
        } else if (type === 'currency') {
            filterProperty = this.currencies;
        } else if (type === 'country_of_origin') {
            filterProperty = this.country_results;
        } else if (type === 'country') {
            filterProperty = this.country_location_results;
        } else if (type === 'composition_upper') {
            filterProperty = this.composition_inner_upper;
        } else if (type === 'composition_lining') {
            filterProperty = this.composition_inner_lining;
        } else if (type === 'composition_sock') {
            filterProperty = this.composition_inner_sock;
        } else if (type === 'composition_outer_sole') {
            filterProperty = this.composition_outer;
        } else if (type === 'brand') {
            filterProperty = this.brands_results;
        } else if (type === 'seller') {
            filterProperty = this.sellers_results;
        }
        return filterProperty;
    }

    clearFilter() {
        this.isFiltered = true;
        this.by_pairs = false;
        this.by_prepacks = false;

        this.genders = this.genders.filter(gender => {
            gender.selected = false;
            return true;
        });
        this.styles = this.styles.filter(style => {
            style.selected = false;
            return true;
        });
        this.packing_type = this.packing_type.filter(condition => {
            condition.selected = false;
            return true;
        });
        this.price_types = this.price_types.filter(price_type => {
            price_type.selected = false;
            return true;
        });
        this.collectionOrStock = this.collectionOrStock.filter(item => {
            item.selected = false;
            return true;
        });
        this.colors = this.colors.filter(color => {
            color.selected = false;
            return true;
        });
        this.currencies = this.currencies.filter(currency => {
            currency.selected = false;
            return true;
        });
        this.countries = this.countries.filter(country => {
            country.selected = false;
            return true;
        });
        this.countries_location = this.countries_location.filter(country => {
            country.selected = false;
            return true;
        });
        this.brands = this.brands.filter(brand => {
            brand.selected = false;
            return true;
        });
        this.sellers = this.sellers.filter(seller => {
            seller.selected = false;
            return true;
        });
        this.composition_inner_upper = this.composition_inner_upper.filter(e => {
            e.selected = false;
            return true;
        });
        this.composition_inner_lining = this.composition_inner_lining.filter(e => {
            e.selected = false;
            return true;
        });
        this.composition_inner_sock = this.composition_inner_sock.filter(e => {
            e.selected = false;
            return true;
        });
        this.composition_outer = this.composition_outer.filter(e => {
            e.selected = false;
            return true;
        });

        this.selectedFilters = [];
        this.filterArray = [];
        this.urlFilter = '';
        this.passToParent();
    }

    searchFilter(type) {
        console.log(this.country_search);
        switch (type) {
            case 'countries':
                this.country_results = this.countries.filter(e => {
                    return e.name.toLowerCase().includes(this.country_search.toLowerCase());
                });
                break;
            case 'countries_location':
                this.country_location_results = this.countries_location.filter(e => {
                    return e.name.toLowerCase().includes(this.country_location_search.toLowerCase());
                });
                break;
            case 'brands':
                this.brands_results = this.brands.filter(e => {
                    return e.name.toLowerCase().includes(this.brands_search.toLowerCase());
                });
                break;
            case 'sellers':
                this.sellers_results = this.sellers.filter(e => {
                    return e.full_name.toLowerCase().includes(this.sellers_search.toLowerCase());
                });
                break;
            default:
                break;
        }
    }

    getFiltersItems() {
        if (isPlatformBrowser(this.platformId)) {
            let visitor = localStorage.getItem('visitor');
            let user = this.userService.getCurrentUser();
            console.log(this.scope);
            if (user) {
                this.scopeUser = user.scope[0];
            } else {
                this.scopeUser = 'notRegistered';
            }
            this.languageService.currentLanguage.subscribe(lang => {
                if (visitor || this.scopeUser === 'notRegistered') {
                    this.productsService.productChoisesVisitor(lang)
                        .subscribe(
                            data => {
                                this.productChoises = data;
                                this.genders = this.productChoises.gender;
                                this.styles = this.productChoises.style.sort((a, b) => {
                                    a.admin_order - b.admin_order;
                                });
                                this.currencies = this.productChoises.currency;
                                this.productsService.productChoisesVisitor('en').subscribe(response => this.colors = response['color']);
                                this.packing_type = this.productChoises.packing_type;
                                this.countries = this.productChoises.country;
                                this.country_results = this.countries.map(a => ({...a}));
                                this.country_location_results = this.countries.map(a => ({...a}));
                                this.composition_inner_upper = Object.assign(this.composition_inner_upper, this.productChoises.composition_upper_linning_sock);
                                this.composition_inner_upper = this.composition_inner_upper.map(e => {
                                    return Object.assign({}, e, {
                                        name: e.name
                                    });
                                });
                                this.composition_inner_lining = Object.assign(this.composition_inner_lining, this.productChoises.composition_upper_linning_sock);
                                this.composition_inner_lining = this.composition_inner_lining.map(e => {
                                    return Object.assign({}, e, {
                                        name: e.name
                                    });
                                });
                                this.composition_inner_sock = Object.assign(this.composition_inner_sock, this.productChoises.composition_upper_linning_sock);
                                this.composition_inner_sock = this.composition_inner_sock.map(e => {
                                    return Object.assign({}, e, {
                                        name: e.name
                                    });
                                });

                                this.composition_outer = this.productChoises.composition_Outer;
                            },
                            error => {
                                console.log('Eror data');
                            });

                    const self = this;
                    var offset_br = 0;
                    var brands = function (self) {
                        console.log('offset: ', offset_br);
                        self.productsService.getBrandsForVisitor(offset_br, self.shop, self._sellerId).subscribe(data => {
                            self.brands = self.brands.concat(data['results']);
                            self.brands_results = self.brands_results.concat(data['results']);
                            if (data['next']) {
                                offset_br = data['next'].split('offset=').pop();
                                brands(self);
                            }
                        });
                    };
                    brands(self);
                    var offset = 0;
                    var sellers = function (self) {
                        console.log('offset: ', offset);
                        self.productsService.getSellersForVisitor(offset).subscribe(data => {
                            self.sellers = self.sellers.concat(data['results']);
                            self.sellers_results = self.sellers_results.concat(data['results']);
                            if (data['next']) {
                                offset = data['next'].split('offset=').pop();
                                sellers(self);
                            }
                        });
                    };
                    sellers(self);
                } else {
                    this.productsService.productChoises(this.userService.getCurrentUserToken(), lang)
                        .subscribe(
                            data => {
                                this.productChoises = data;
                                console.log(this.productChoises);
                                this.genders = this.productChoises.gender;
                                this.styles = this.productChoises.style.sort();
                                this.currencies = this.productChoises.currency;
                                this.productsService.productChoises(this.userService.getCurrentUserToken(), 'en').subscribe(response => this.colors = response['color']);
                                this.packing_type = this.productChoises.packing_type;
                                this.countries = this.productChoises.country;
                                this.country_results = this.countries.map(a => ({...a}));
                                this.countries_location = this.countries.map(a => ({...a}));
                                this.country_location_results = this.countries.map(a => ({...a}));
                                this.composition_inner_upper = Object.assign(this.composition_inner_upper, this.productChoises.composition_upper_linning_sock);
                                this.composition_inner_upper = this.composition_inner_upper.map(e => {
                                    return Object.assign({}, e, {
                                        name: e.name
                                    });
                                });
                                this.composition_inner_lining = Object.assign(this.composition_inner_lining, this.productChoises.composition_upper_linning_sock);
                                this.composition_inner_lining = this.composition_inner_lining.map(e => {
                                    return Object.assign({}, e, {
                                        name: e.name
                                    });
                                });
                                this.composition_inner_sock = Object.assign(this.composition_inner_sock, this.productChoises.composition_upper_linning_sock);
                                this.composition_inner_sock = this.composition_inner_sock.map(e => {
                                    return Object.assign({}, e, {
                                        name: e.name
                                    });
                                });

                                this.composition_outer = this.productChoises.composition_Outer;
                            },
                            error => {
                                console.log('Eror data');
                            });

                    var offset = 0;
                    var sellers = function (self) {
                        console.log('offset: ', offset);
                        self.productsService.getSellers(self.userService.getCurrentUserToken(), offset).subscribe(data => {
                            self.sellers = self.sellers.concat(data['results']);
                            self.sellers_results = self.sellers_results.concat(data['results']);
                            if (data['next']) {
                                offset = data['next'].split('offset=').pop();
                                sellers(self);
                            }
                        });
                    };
                    let self = this;
                    sellers(self);

                    var offset_br = 0;
                    var brands = function (self) {
                        console.log('offset: ', offset_br);
                        self.productsService.getBrands(self.userService.getCurrentUserToken(), offset_br, self.shop, self._sellerId).subscribe(data => {
                            self.brands = self.brands.concat(data['results']);
                            self.brands_results = self.brands_results.concat(data['results']);
                            if (data['next']) {
                                offset_br = data['next'].split('offset=').pop();
                                brands(self);
                            }
                        });
                    };
                    brands(self);
                }
            });
        }
    }

    ngOnInit() {
        this.url = this.router.url;
        this.productSearch = this.route.snapshot.paramMap.get('name');
        this.getFiltersItems();
        this.languageService.currentLanguage.subscribe(lang => {
            setTimeout(this.translateValues.bind(this), 2000);
            setTimeout(this.translateCollectionValues.bind(this), 2000);
        })
    }

    translateValues() {
        this.priceTypesTranslated = this.price_types.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        if(this.priceTypesTranslated.some(e =>e.name == undefined)) {
            setTimeout(this.translateValues.bind(this), 500);
        } else { return this.priceTypesTranslated; }
    }
    translateCollectionValues() {
        this.collectionOrStockTranslated = this.collectionOrStock.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        if(this.collectionOrStockTranslated.some(e =>e.name == undefined)) {
            setTimeout(this.translateCollectionValues.bind(this), 500);
        } else { return this.collectionOrStockTranslated; }
    }


}
