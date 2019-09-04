import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FiltersComponent} from '../../components/dashboard/filters/filters.component';
import {PaginationChangedEvent} from '../../events';
import {PaginationComponent} from '../messenger/components/pagination/pagination.component';
import { DatePipe } from '@angular/common';
import {FormService} from '../../_services/form';

@Component({
    selector: 'app-seller-main',
    templateUrl: 'seller.component.html',
    styleUrls: ['seller.component.css']
})

export class SellerComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild("insideElement") insideElement;
    @ViewChild(PaginationComponent) pagination;
    @Input() promo = false;
    @Input() asBuyer = false;
    products: any;
    productChoises: any;
    sellers: any;
    is_loading: boolean;
    by_pairs: boolean = false;
    by_prepacks: boolean = false;
    noProducts: boolean = false;
    totalItems: number;
    heels: any;
    response: any;
    currentPage: number;
    query: string;
    myForm: FormGroup;
    urlFilter: string = '';
    urlSort: string = '';
    hideme: any = [];
    filterArray: any = [];
    productArr: any = [];
    count: number;
    showGroupAction: boolean = false;
    selItem: any = [];
    showrooms: any = [];
    showroomToPush: any = {};
    productToPush: any = {};
    finalProduct: any = {};
    currentDate: any;
    groupShowroomData: any = [];
    isFilterMenuOpened: boolean = false;
    filterCategory: string = 'all';
    groupShowroom = false;
    onlyShowroom = true;
    onlyPromote = false;
    onlyNoPromote = false;
    onlyPublic = false;
    onlyBlank = false;
    productArray: any = [];
    hideProducts: any = [];
    unHideProducts: any = [];
    onlyShowroomProducts: any = [];
    dataProduct: any = [];
    finalProductArray: any = [];
    productsGet: any = [];
    id: number = null;
    onlyPublicProducts: any = [];
    noBlankProducts: any = [];
    form_group = new FormGroup({
        showroom: new FormControl({}),
        discount_percent: new FormControl(null, [Validators.required]),
        discount_end_date: new FormControl(null, [Validators.required])
    });
    form_group_promo = new FormGroup({
        discount_price: new FormControl(null, [Validators.required]),
        discount_end_date: new FormControl(null, [Validators.required])
    })
    isStock: any = [{id: 0, name: 'Stock'},{id: 2, name: 'Collection'}, {id: 1, name: 'All'}];
    isStockFilter = '';
    sub: string;
    order: any = {
        items: []
    };
    sizes: any = [];
    total_price: any = [];
    total_price_with_discount: any = [];
    prepacksQuantity: any = [];
    Object = Object;
    sumSizes: any = [];
    data: any;
    currentOrderItem: any = [];
    form_offer = new FormGroup({
        email: new FormControl(null),
        name: new FormControl('', [Validators.maxLength(80)]),
        description: new FormControl(''),
        items: new FormControl(null)
    });
    items: any = {};
    isErrorQuantity = false;
    errorMes: any = [];
    array: any = [];
    errorArray: any = [];
    dialogId: number;
    isHovering: any = [];
    hoveringItem: number;
    errorQuantity: boolean[] = [];
    errorDisabled: boolean = false;
    errorDisabledPrepack = false;
    errorPrepackQuantity: boolean[] = [];
    disabledAddToShowroom = false;
    isLoading = false;
    showroomId: string;
    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        if ( !this.asBuyer) {
            const clickedInside = this.insideElement.nativeElement.contains(targetElement);
            if (!clickedInside) {
                this.isFilterMenuOpened = false;
            }
        }
    }

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        public router: Router,
        private modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private alertService: AlertService,
        private userService: UserService,
        private datePipe: DatePipe,
        private showroomService: ShowroomsService) {
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


    addToShowroom() {
        this.showroomToPush = this.form_group.controls.showroom.value;
       // this.productToPush.showroom_id = this.showroomToPush.id;

       console.log(this.productToPush);
        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productToPush.id)
            .subscribe (
                data => {
                    console.log(data);
                    this.modalService.close('custom-modal-4');
                    this.finalProduct = data;
                    this.finalProduct.showroom_id = this.showroomToPush.id;
                    this.finalProduct.is_bidding_allowed = false;
                    if (this.finalProduct.is_hidden) {
                        this.finalProduct.is_hidden = false;
                    }
                    console.log(this.finalProduct);
                    this.updateProd();
                }
            );
    }
    updateProd() {
        this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
                .subscribe(
                    data=> {
                        console.log(data);
                        this.pagination.currentPage = 1;
                        this.loadPages();
                        },
                        error => {
                        console.log(error);
                    }
                )
    }
    getShowrooms() {
        var query = "&limit=100&offset=0"
        this.showroomService.activeShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.response = data;
                    this.showrooms = this.response.results;
                    !this.showrooms.length ? this.disabledAddToShowroom = true : this.disabledAddToShowroom = false;
                    console.log(this.response.results);
                },
                error => {
                    console.log(error);
                }
            )
    }
    onFilterChenge(filter) {
        if (!this.sub) {
            this.productArray = [];
            this.productArr = [];
            this.showGroupAction = false;
            this.selItem = [];
            this.onlyShowroomProducts = [];
            this.hideProducts = [];
            this.unHideProducts = [];
        }
        this.urlFilter = filter;
        var query = `&limit=40&offset=0` + this.urlFilter + this.urlSort;
        if (this.promo) {
            query += '&has_discount=true';
        }
        if (this.urlFilter || this.filterCategory) {
            this.loadPages();
            // this.productsService.sellerFilterProducts(this.userService.getCurrentUserToken(), query, this.filterCategory).subscribe(response => {
            //     this.response = response;
            //     this.pagination.totalRows = this.response.count;
            //     this.pagination.currentPage = 1;
            //     this.products = this.response.results;
            //     if (this.products.length > 0) {
            //         this.noProducts = false;
            //     } else {
            //         this.noProducts = true;
            //     }
            // });
        } else {
            this.getProducts();
        }
    }
    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }

    checkDiscountDateExpiration(date) {
        return Date.parse(date) < Date.now();
    }

    filterProductCategory(type, e?: Event) {
        if (!this.sub) {
            this.productArray = [];
            this.productArr = [];
            this.showGroupAction = false;
            this.selItem = [];
            this.onlyShowroomProducts = [];
            this.hideProducts = [];
            this.unHideProducts = [];
        } else {
            this.selItem = [];
        }
        this.isFilterMenuOpened = !this.isFilterMenuOpened;
        this.filterCategory = type;
        if (this.promo) {
            this.router.navigate(['/dashboard/seller', {filterCategory: type}]);
            return
        }
        if (e) {
            let target = e.target;
            $(target).parent().prependTo('.filter-menu ul');
        }
        this.onFilterChenge('');

    }

    getProducts() {
        this.currentDate = new Date().getTime();
        this.productsService.sellerProductPage(this.userService.getCurrentUserToken(), this.urlSort + this.urlFilter + this.isStockFilter).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.pagination.currentPage = 1;
            this.products = this.response.results;
            if (this.products.length > 0) {
                this.noProducts = false;
            } else {
                this.noProducts = true;
            }

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

    ngOnInit() {
        this.sub = this.route.snapshot.paramMap.get('data');
        this.showroomId = this.route.snapshot.queryParams.id;
        if (this.sub === 'orderEdit' || this.showroomId) {
            this.filterCategory = 'published';
            let orderId = this.route.snapshot.paramMap.get('order');
            this.productsService.getOrderInfo(this.userService.getCurrentUserToken(), orderId).subscribe( data => {
                console.log(data);
                this.data = data;
                this.dialogId = this.data.dialog_id
                this.loadPages();
            }, error => {
                console.log(error);
            });
        }

        this.currentDate = new Date().getTime();
        this.urlFilter = '';
        if (this.promo) {
          this.loadPages('&has_discount=true');
        } else {
            this.loadPages();
        }
        // product state filter
        // let self = this;
        // $(window).click(function () {
        //     self.isFilterMenuOpened = false;
        // });
        // $('.filter-menu').click(function (event) {
        //     event.stopPropagation();
        // });

        const filterCategory = this.route.snapshot.paramMap.get('filterCategory');
        if (filterCategory) {
            this.filterProductCategory(filterCategory);
            this.isFilterMenuOpened = true;
        }
        this.form_offer.valueChanges.subscribe(value => {
            this.items = Object.assign({}, value)
        });

    }

    productLink(id) {
        if ( this.asBuyer) {
            this.router.navigate(['dashboard/buyer/product/', id]);
        } else {
            this.router.navigate(['dashboard/seller/product/', id]);
        }
    }

    productArchive(id) {
        this.productsService.archiveProduct(this.userService.getCurrentUserToken(), id).subscribe(
            data => {
                console.log(data);
                let offset = (this.pagination.currentPage - 1) * 40;
                this.loadPages('', 40, offset);
                },
            error => {
                this.alertService.errorRegistration(error, this.form);
            });
    }
    productMakePromo(id, product) {
        this.modalService.open('promo-one');
        this.id = id;
        this.form_group_promo.get('discount_price').setValue(Number(product.price).toFixed(2) + ' ' + product.currency)

    }
    addPromotion() {
        if (!this.form_group_promo.valid ) {
            new FormService().markTouched(this.form_group_promo)
            return;
        }
        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.id)
            .subscribe (
                data => {
                    console.log(data);
                    this.modalService.close('promo-one');
                    this.finalProduct = data;
                    this.finalProduct.is_bidding_allowed = false;
                    this.finalProduct.has_discount = true;
                    this.finalProduct.discount_end_date = this.form_group_promo.controls['discount_end_date'].value;
                    this.finalProduct.discount_price = parseFloat(this.form_group_promo.controls['discount_price'].value);
                    this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
                        .subscribe(
                            response => {
                                console.log(response);
                                this.pagination.currentPage = 1;
                                this.loadPages();
                            },
                            error => {
                                console.log(error);
                            }
                        )
                }
            );
    }
    onGroupPromotions() {
        if (!this.form_group.valid ) {
            new FormService().markTouched(this.form_group)
            return;
        }
        let bathArr = [];
        for (let i = 0; i < this.noBlankProducts.length; i++) {
            bathArr.push({
                "method": "GET",
                "path": `/api/v1/products/${this.noBlankProducts[i].id}/`
            })
        }
        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( data => {
            console.log(data);
            this.finalProductArray = data;
            for (let i = 0; i < this.finalProductArray.length; i++) {
                this.finalProductArray[i].data.is_bidding_allowed = false;
                this.finalProductArray[i].data.has_discount = true;
                this.finalProductArray[i].data.discount_end_date = this.form_group.controls['discount_end_date'].value;
                this.finalProductArray[i].data.discount_price = ((1 - Number(this.form_group.controls['discount_percent'].value) / 100)
                    * Number(this.finalProductArray[i].data.price)).toFixed(2);
            };
            bathArr = [];
            for (let i = 0; i < this.noBlankProducts.length; i++) {
                bathArr.push({
                    "method": "POST",
                    "path": `/api/v1/products/${this.noBlankProducts[i].id}/publish`,
                    "data": this.finalProductArray[i].data
                })
            };
            this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( response => {
                console.log(response);
                this.errorArray = response;
                console.log(this.errorArray);
                this.array = Object.assign([], this.productArray);
                this.showGroupAction = false;
                this.productArr = [];
                this.productArray = [];
                this.onlyPublicProducts = [];
                this.noBlankProducts = [];
                this.selItem = [];
                this.onlyPromote = false;
                this.onlyNoPromote = false;
                this.pagination.currentPage = 1;
                this.modalService.close('promo');
                this.loadPages();
            }, error => {
                console.log(error);
            })

        }, error => {
            console.log(error)
        })
    }

    removeFromPromo(id) {
        this.productsService.getProduct(this.userService.getCurrentUserToken(), id)
            .subscribe(data => {
                data['is_bidding_allowed'] = false;
                data['has_discount'] = false;
                delete data['discount_end_date'];
                delete data['discount_price'];
                this.productsService.editProduct(this.userService.getCurrentUserToken(), data['id'], data)
                    .subscribe(_ => {
                        this.showGroupAction = false;
                        this.productArr = [];
                        this.productArray = [];
                        this.onlyPublicProducts = [];
                        this.noBlankProducts = [];
                        this.selItem = [];
                        this.onlyPromote = false;
                        this.onlyNoPromote = false;
                        this.pagination.currentPage = 1;
                        this.loadPages();
                    })
            })
    }
    removeDiscount() {
        let bathArr = [];
        for (let i = 0; i < this.noBlankProducts.length; i++) {
            bathArr.push({
                "method": "GET",
                "path": `/api/v1/products/${this.noBlankProducts[i].id}/`
            })
        }
        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( data => {
            console.log(data);
            this.finalProductArray = data;
            for (let i = 0; i < this.finalProductArray.length; i++) {
                this.finalProductArray[i].data.is_bidding_allowed = false;
                this.finalProductArray[i].data.has_discount = false;
                this.finalProductArray[i].data.discount_end_date = null;
                this.finalProductArray[i].data.discount_price = null;
            };
            bathArr = [];
            for (let i = 0; i < this.noBlankProducts.length; i++) {
                bathArr.push({
                    "method": "POST",
                    "path": `/api/v1/products/${this.noBlankProducts[i].id}/publish`,
                    "data": this.finalProductArray[i].data
                })
            };
            this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( response => {
                console.log(response);
                this.showGroupAction = false;
                this.productArr = [];
                this.productArray = [];
                this.onlyPublicProducts = [];
                this.noBlankProducts = [];
                this.selItem = [];
                this.onlyPromote = false;
                this.onlyNoPromote = false;
                this.pagination.currentPage = 1;
                this.modalService.close('promo');
                this.loadPages();
            }, error => {
                console.log(error);
            })

        }, error => {
            console.log(error)
        })

    }
    onGroupShowroom() {
        if(!this.showroomId) {
            this.modalService.close('custom-modal-4');
            this.showroomToPush = this.form_group.controls.showroom.value;
        } else {
            this.showroomToPush.id = this.showroomId;
        }
        let bathArr = [];
        for (let i = 0; i < this.productArr.length; i++) {
            bathArr.push({
                "method": "GET",
                "path": `/api/v1/products/${this.productArr[i]}/`
            })
        }
        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( data => {
            console.log(data);
            this.finalProductArray = data;
            for (let i = 0; i < this.finalProductArray.length; i++) {
                this.finalProductArray[i].data.showroom_id = this.showroomToPush.id;
                this.finalProductArray[i].data.is_bidding_allowed = false;
                if (this.finalProductArray[i].data.is_hidden) {
                    this.finalProductArray[i].data.is_hidden = false;
                }
            };
            bathArr = [];
            for (let i = 0; i < this.productArr.length; i++) {
                bathArr.push({
                    "method": "POST",
                    "path": `/api/v1/products/${this.productArr[i]}/publish`,
                    "data": this.finalProductArray[i].data
                })
            };
            this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( response => {
                console.log(response);
                this.showGroupAction = false;
                this.productArr = [];
                this.productArray = [];
                this.selItem = [];
                this.pagination.currentPage = 1;
                if (this.showroomId) {
                    this.router.navigate([`dashboard/seller/showroom/${this.showroomId}`]);
                }
                this.loadPages();
                }, error => {
                console.log(error);
            })

        }, error => {
            console.log(error)
        })

        }
    onGroupArchive() {
        let bathArr = [];
        for (let i = 0; i < this.productArr.length; i++) {
            bathArr.push({
                "method": "POST",
                "path": `/api/v1/products/${this.productArr[i]}/archive`
            })
        }
        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( data => {
            console.log(data);
            this.showGroupAction = false;
            this.productArr = [];
            this.selItem = [];
            let offset = (this.pagination.currentPage - 1) * 25;
            this.loadPages('', 25, offset);
        }, error => {
            console.log(error);
            alert('Something went wrong! Please, refresh and try again');
        })
    }
    onGroupHide() {
        if (this.unHideProducts.length) {
            let bathArr = [];
            for (let i = 0; i < this.unHideProducts.length; i++) {
                bathArr.push({
                    "method": "POST",
                    "path": `/api/v1/products/${this.unHideProducts[i].id}/hide/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),  {"operations": bathArr}).subscribe( data => {
                console.log(data);
                this.showGroupAction = false;
                this.unHideProducts = [];
                if (!this.onlyShowroomProducts.length) {
                    this.productArr = [];
                    this.productArray = [];
                }
                this.selItem = [];
                let offset = (this.pagination.currentPage - 1) * 25;
                this.loadPages('', 25, offset);
            }, error => {
                console.log(error);
                alert('Something went wrong! Please, refresh and try again');
            })
        }
        if (this.onlyShowroomProducts.length) {
            let bathArrShowroom = [];
            for (let i = 0; i < this.onlyShowroomProducts.length; i++) {
                bathArrShowroom.push({
                    "method": "GET",
                    "path": `/api/v1/products/${this.onlyShowroomProducts[i].id}/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArrShowroom}).subscribe( data => {
                console.log(data);
                let bathArrNext = [];
                this.productsGet = data;
                for (let i = 0; i < this.productsGet.length; i++) {
                    this.productsGet[i].data.showroom_id = null;
                    bathArrNext.push({
                        "method": "POST",
                        "path": `/api/v1/products/${this.productsGet[i].data.id}/publish/`,
                        "data": this.productsGet[i].data
                    })
                }
                    this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArrNext}).subscribe( response => {
                        console.log(response);
                        bathArrNext = [];
                        this.dataProduct = response;
                        for (let i = 0; i < this.dataProduct.length; i++) {
                            this.dataProduct[i].data.showroom_id = null;
                            bathArrNext.push({
                                "method": "POST",
                                "path": `/api/v1/products/${this.dataProduct[i].data.id}/hide/`
                            })
                        }
                        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArrNext}).subscribe( next => {
                            console.log(next);
                            let offset = (this.pagination.currentPage - 1) * 25;
                            this.loadPages('', 25, offset);
                            this.showGroupAction = false;
                            if (!this.unHideProducts.length) {
                                this.productArr = [];
                                this.productArray = [];
                            }
                            this.selItem = [];
                            this.onlyShowroomProducts = [];
                        }, error => {
                            console.log(error);
                        })
                    }, error => {
                        console.log(error);
                    })
            }, error => {
                console.log(error);
                alert('Something went wrong! Please, refresh and try again');
            })
        }


    }
    onGroupPublish() {
        if (this.hideProducts.length) {
            let bathArr = [];
            for (let i = 0; i < this.hideProducts.length; i++) {
                bathArr.push({
                    "method": "DELETE",
                    "path": `/api/v1/products/${this.hideProducts[i].id}/hide/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),  {"operations": bathArr}).subscribe( data => {
                console.log(data);
                this.showGroupAction = false;
                if (!this.onlyShowroomProducts.length) {
                    this.productArr = [];
                    this.productArray = [];
                }
                this.selItem = [];
                this.hideProducts = [];
                let offset = (this.pagination.currentPage - 1) * 25;
                this.loadPages('', 25, offset);
            }, error => {
                console.log(error);
                alert('Something went wrong! Please, refresh and try again');
            })

        }
        if (this.onlyShowroomProducts.length) {
            let bathArrShowroom = [];
            for (let i = 0; i < this.onlyShowroomProducts.length; i++) {
                bathArrShowroom.push({
                    "method": "GET",
                    "path": `/api/v1/products/${this.onlyShowroomProducts[i].id}/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArrShowroom}).subscribe( data => {
                console.log(data);
                let bathArrNext = [];
                this.productsGet = data;
                for (let i = 0; i < this.productsGet.length; i++) {
                    this.productsGet[i].data.showroom_id = null;
                    bathArrNext.push({
                        "method": "POST",
                        "path": `/api/v1/products/${this.productsGet[i].data.id}/publish/`,
                        "data": this.productsGet[i].data
                    })
                }
                this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArrNext}).
                subscribe( response => {
                    console.log(response);
                    let offset = (this.pagination.currentPage - 1) * 25;
                    this.loadPages('', 25, offset);
                    this.showGroupAction = false;
                    if (!this.hideProducts.length) {
                        this.productArr = [];
                        this.productArray = [];
                    }
                    this.selItem = [];
                    this.onlyShowroomProducts = [];
                }, error => {
                    console.log(error);
                })
            }, error => {
                console.log(error);
                alert('Something went wrong! Please, refresh and try again');
            })
        }
    }
    onMakeBlank(id, product) {
        if (!product.showroom_id) {
            this.productsService.hideProduct(this.userService.getCurrentUserToken(), id).subscribe(response => {
                console.log(response);
                this.hideme = [];
                let offset = (this.pagination.currentPage - 1) * 25;
                this.loadPages('', 25, offset);
            }, error => {
                console.log(error);
            })
        } else {
                this.productsService.getProduct(this.userService.getCurrentUserToken(), id).subscribe(data => {
                    console.log(data);
                    data['showroom_id'] = null;
                    this.productsService.editProduct(this.userService.getCurrentUserToken(), id, data)
                        .subscribe(
                            response => {
                                console.log(response);
                                this.productsService.hideProduct(this.userService.getCurrentUserToken(), response['id']).subscribe(next => {
                                    console.log(next);
                                    let offset = (this.pagination.currentPage - 1) * 25;
                                    this.loadPages('', 25, offset);
                                    }, error => {
                                    console.log(error);
                                })
                                this.hideme = [];
                            }, error => {
                                console.log(error);
                            }
                        )
                }, error => {
                    console.log(error);
                })
        }
    }
    onPublishProduct(id, product) {
        if (product.is_hidden) {
            this.productsService.unhideProduct(this.userService.getCurrentUserToken(), id).subscribe(response => {
                console.log(response);
                this.hideme = [];
                let offset = (this.pagination.currentPage - 1) * 25;
                this.loadPages('', 25, offset);
                }, error => {
                console.log(error);
            })
        } else if (product.showroom_id) {
            this.productsService.getProduct(this.userService.getCurrentUserToken(), id).subscribe(data => {
                console.log(data);
                data['showroom_id'] = null;
                this.productsService.editProduct(this.userService.getCurrentUserToken(), id, data)
                    .subscribe(
                        response => {
                            console.log(response);
                            this.productsService.unhideProduct(this.userService.getCurrentUserToken(), response['id']).subscribe(next => {
                                console.log(next);
                                let offset = (this.pagination.currentPage - 1) * 25;
                                this.loadPages('', 25, offset);
                                }, error => {
                                console.log(error);
                            })
                            this.hideme = [];
                        }, error => {
                            console.log(error);
                        }
                    )
            }, error => {
                console.log(error);
            })
        }
    }
    productEditOne(id) {
        this.router.navigate(['dashboard/seller/product/edit/', id]);
    }


    openModal(id, product) {
        this.getShowrooms();
        this.modalService.open(id);
        this.productToPush = product;
    }
    openGroupModal(id, type) {
        this.getShowrooms();
        this.modalService.open(id);
        this.groupShowroom = type;
    }
    openPromopModal(id) {
        this.modalService.open(id);
        this.form_group.reset();
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    undoArchive(id) {
        this.productsService.undoArchive(this.userService.getCurrentUserToken(), id).subscribe(
            data => {
                location.reload();
            },
            error => {
                this.alertService.errorRegistration(error, this.form);
            });
    }
    onSelectedItem(id, selectValue, product) {
        if(selectValue) {
            this.productArr.push(id);
            this.productArray.push(product);
        } else {
            let index = this.productArr.indexOf(id);
            this.productArr.splice(index, 1);
            this.productArray.splice(index, 1);
            let index1 = this.onlyShowroomProducts.indexOf(id);
            this.onlyShowroomProducts.splice(index1, 1);
            let index2 = this.hideProducts.indexOf(id);
            this.hideProducts.splice(index2, 1);
            let index3 = this.unHideProducts.indexOf(id);
            this.unHideProducts.splice(index3, 1);
            let index4 = this.onlyPublicProducts.indexOf(id);
            this.onlyPublicProducts.splice(index4, 1);
        }
        console.log(this.productArr);
        this.onlyShowroom =  !this.productArray.some(element => {
            return element.showroom_id
        });
        this.onlyPromote = this.productArray.every(element => {
            return !element.has_discount && !element.is_hidden
        });
        this.onlyNoPromote = this.productArray.every(element => {
            return element.has_discount;
        })
        this.onlyPublic = this.productArray.every(element => {
            return element.is_hidden || element.showroom_id
        });
        this.onlyBlank = this.productArray.every(element => {
            return !element.is_hidden || element.showroom_id
        });
        this.hideProducts = this.productArray.filter(element => {
           return element.is_hidden
        });
        this.onlyShowroomProducts = this.productArray.filter(element => {
            return element.showroom_id
        });
        this.unHideProducts = this.productArray.filter(element => {
            return !element.is_hidden && !element.showroom_id
        });
        this.onlyPublicProducts = this.productArray.filter(element => {
            return !element.is_hidden && !element.showroom_id
        });
        if (this.productArr.length > 0) {
            this.showGroupAction = true;
        } else {
            this.showGroupAction = false;
        }

        this.noBlankProducts = [];
            this.noBlankProducts = this.noBlankProducts.concat(this.onlyShowroomProducts, this.onlyPublicProducts)
        this.count = this.productArr.length;
    }
    onPageChanged(info:PaginationChangedEvent) {
        this.loadPages(this.urlFilter, info.fetch, info.offset);
        this.selItem = [];
        window.scroll(0,0);
        console.log(this.pagination.currentPage)
    }
    loadPages(query:string='', limit=null, offset=0) {
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        console.log(limit);
        console.log(offset);
        let q = `&limit=${limit}&offset=${offset}` + query + this.urlFilter + this.urlSort + this.isStockFilter;
        if (this.promo) {
            q += '&has_discount=true';
        }
        if (this.sub) {
           // this.filterCategory = 'published';
           // q += '&show_showroom_products=True';
        }
        if (!this.asBuyer) {
            this.productsService.sellerFilterProducts(this.userService.getCurrentUserToken(), q, this.filterCategory).subscribe(response => {
                this.response = response;
                this.pagination.totalRows = this.response.count;
                // this.pagination.currentPage = 1;
                this.products = this.response.results;
                if (this.products.length > 0) {
                    this.noProducts = false;
                } else {
                    this.noProducts = true;
                }
            });
        } else if (this.asBuyer) {
            if (this.data) {
                let queryString = `?seller=${this.data.seller_company.id}&published=True&draft=False&archived=False` + q;
                this.productsService.sellerProduct(this.userService.getCurrentUserToken(),queryString,
                    {
                        'limit': limit,
                        'offset': offset}).subscribe(response => {
                    this.response = response;
                    this.pagination.totalRows = this.response.count;
                    console.log(this.pagination.totalRows);
                    this.products = this.response.results;
                    if (this.products.length > 0) {
                        this.noProducts = false;
                    } else {
                        this.noProducts = true;
                    }

                });
            }
        }
        }
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
    onItemMenuCall() {
        this.productArray = [];
        this.productArr = [];
        this.showGroupAction = false;
        this.selItem = [];
        this.onlyShowroomProducts = [];
        this.hideProducts = [];
        this.unHideProducts = [];
    }
    onStockChange(e) {
        console.log(e);
        if (e.id === 0) {
            this.isStockFilter = '&availability_type=in_stock';
            this.loadPages();

        } else if (e.id === 2) {
            this.isStockFilter = '&availability_type=collection';
            this.loadPages();
        } else {
            this.isStockFilter = '';
            this.loadPages();
        }
    }
    getGroupInfo() {
        let bathArr = [];
        for (let i = 0; i < this.productArr.length; i++) {
            bathArr.push({
                "method": "GET",
                "path": `/api/v1/products/${this.productArr[i]}/`
            })
        }
        console.log(bathArr);
        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( response => {
            console.log(response);
            this.productsGet = response;
            this.isLoading = false;
            for (let i = 0; i < this.productsGet.length; i++) {
                if (this.productsGet[i].data.sizes) {
                    this.order.items.push({
                        'product': this.productsGet[i].data,
                        'product_id': this.productsGet[i].data.id,
                        'size_quantities': this.sizes[i],
                        'total_price': this.total_price[i],
                        'total_price_with_discount': this.total_price_with_discount[i]
                    });
                    this.sizes.push(Object.entries(this.productsGet[i].data.sizes).map(([key, value]) => ({key, value})));

                } else if (this.productsGet[i].data.prepacks) {
                    for (let j = 0; j < this.productsGet[i].data.prepacks.length; j++) {
                        this.order.items.push({
                            'product':  this.productsGet[i].data,
                            'product_id': this.productsGet[i].data.id,
                            'prepack': this.productsGet[i].data.prepacks[j],
                            'prepack_id': this.productsGet[i].data.prepacks[j].id,
                            'quantity': this.prepacksQuantity[i],
                            'total_price': this.total_price[i],
                            'total_price_with_discount':this.total_price_with_discount[i]
                        });
                        this.sizes.push([{}]);
                    }

                }
            }
            for ( let j = 0; j < this.sizes.length; j++) {
                this.sizes[j].forEach(function (item) {
                    item.quantity = '';
                })
                this.sizes[j].sort(function (a: any, b: any) {
                    return (+a.key) - (+b.key);
                });
            }
            console.log(this.sizes);
            console.log(this.order.items);
            this.modalService.open('addToOffer');

        }, error => {
            console.log(error);
            this.isLoading = false;
            alert('Something went wrong! Please, refresh and try again');
        })
    }
    onAddToOffer() {
        if (this.productArr.length === 0) {
            return
        }
        if ( this.sub !== 'add to order') {
            this.isLoading = true;
            this.order.items = [];
            this.sizes = [];
            this.isErrorQuantity = false;
            let orderId = this.route.snapshot.paramMap.get('order');
            this.productsService.getOrderInfo(this.userService.getCurrentUserToken(), orderId).subscribe( data => {
                console.log(data);
                this.data = data;
                for (let k = 0; k < this.data.items.length; k++) {
                    this.currentOrderItem[k] = this.data.items[k]
                    this.currentOrderItem[k].product_id = this.currentOrderItem[k].product.id;
                    if (this.currentOrderItem[k].prepack) {
                        this.currentOrderItem[k].prepack_id = this.currentOrderItem[k].prepack.id
                    }
                }
                this.getGroupInfo();

            }, error => {
                console.log(error);
            });
        } else {
            this.isLoading = true;
            this.order.items = [];
            this.sizes = [];
            this.isErrorQuantity = false;
            this.getGroupInfo();
        }
    }
    onPrepackQuantityChange(item, i, input_quantity, available_quantity) {
        console.log(item);
        console.log(this.prepacksQuantity);
        item.quantity = this.prepacksQuantity[i];
        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
        let totalQuantity = sumValues(item.prepack.sizes);
        item.total_price = Number(totalQuantity) * item.quantity * Number(item.product.price);
        item.total_price_with_discount = item.total_price;
        if (!available_quantity) {
            return
        }
        if (+input_quantity > +available_quantity) {
            this.errorPrepackQuantity[i] = true;
        } else {
            this.errorPrepackQuantity[i] = false;
        }
        this.errorDisabledPrepack = this.errorPrepackQuantity.some(elem => {
            return elem === true
        })
    }
    onSizeChange(item, size, quantity, value, i) {
        console.log(item);
        console.log(size);
        item.size_quantities = size;
        this.sumSizes[i] = size.reduce((acc, cur) => Number(acc) + Number(cur.quantity), 0);
        console.log(this.sumSizes);
        item.total_price = this.sumSizes[i] * Number(item.product.price);
        item.total_price_with_discount = item.total_price;
        console.log(`quantity - ${quantity}, value - ${value}`);
        if (+quantity > +value) {
            this.errorQuantity[i] = true;
        } else {
            this.errorQuantity[i] = false;
        }
        this.errorDisabled = this.errorQuantity.some(elem => {
            return elem === true
        })
    }
    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    onOrderAddProduct() {
        this.isLoading = true;
        const orderId = this.route.snapshot.paramMap.get('order');
        const finalQuantity = [];
        const finalSizes = [];
        const sizes = [];
        for (let i = 0; i < this.order.items.length; i++) {
            console.log(this.order.items[i]);
            if (!this.order.items[i].total_price) {
                this.isErrorQuantity = true;
                this.isLoading = false;
                return
            } else {
                this.isErrorQuantity = false;
            }
        }
        for (let i = 0; i < this.order.items.length; i++) {
            if (!this.isErrorQuantity ) {
                if (this.order.items[i].size_quantities) {
                    finalSizes[i] = JSON.parse(JSON.stringify(this.order.items[i].size_quantities));
                    finalQuantity[i] = finalSizes[i].filter(x => {
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
                    sizes[i] = finalQuantity[i].reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});
                    this.order.items[i].size_quantities = sizes[i];
                }
            }

        }
        let items = Object.assign([], this.order.items);
        items = this.currentOrderItem.concat(this.order.items);
        console.log(items);
        if (!this.isErrorQuantity ) {
            if (this.sub !== 'add to order') {
                this.productsService.updateOrder(this.userService.getCurrentUserToken(), orderId, {'items': items}).subscribe(response => {
                    console.log(response);
                    this.isLoading = false;
                    this.modalService.close('addToOffer');
                    this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialogId}`]);
                }, error => {
                    console.log(error);
                    let indexArr = [];
                    this.isLoading = false;
                    error.error.items.forEach((item, index) => {
                        if (Object.keys(item).length !== 0) {
                            indexArr.push(index)
                        }
                    })
                    console.log(indexArr);
                    for (let i = 0; i < indexArr.length; i++) {
                        this.errorMes[i] = `Product "${items[indexArr[i]].product.title}" was changed. Please, remove this item and recreate`;

                    }
                    this.modalService.close('addToOffer');
                    this.modalService.open('modal-error');
                })
            } else {
                this.form_offer.get('items').setValue(items);
                console.log(this.items);
                this.productsService.createSellerCart(this.userService.getCurrentUserToken(), this.items).subscribe(data => {
                    console.log(data);
                    this.isLoading = false;
                    this.modalService.close('addToOffer');
                    this.modalService.open('custom-modal-5');
                    this.productArray = [];
                    this.productArr = [];
                    this.selItem = [];
                    this.count = 0;
                    this.sub = '';
                    this.order.items = [];
                    this.sizes = [];
                    this.showGroupAction = false;
                    this.form_offer.reset();
                }, error => {
                    console.log(error);
                    this.isLoading = false;
                    alert('Something went wrong! Please, refresh and try again');
                })
            }
        }
    }
    onNextAddToOrder() {
        this.form_offer.get('email').setValidators([Validators.required, Validators.email]);
        this.form_offer.get('email').updateValueAndValidity();
        if (!this.form_offer.valid) {
            new FormService().markTouched(this.form_offer);
            return;
        }
        this.filterCategory = 'published';
        console.log(this.form_offer);
        this.showGroupAction = true;
        this.sub = 'add to order';
        this.loadPages();
        this.modalService.close('add_offer');
    }
    onFilterCollaps() {
        // if (this.sub === 'add to order' || this.sub === 'orderEdit') {
        // }
        this.isFilterMenuOpened = !this.isFilterMenuOpened;
    }

    clearAll() {
        this.productArray = [];
        this.productArr = [];
        this.selItem = [];
        this.order.items = [];
        this.count = 0;
        this.onlyShowroomProducts = [];
        this.hideProducts = [];
        this.unHideProducts = [];
    }
    onCancelGroupAction() {
        if (this.sub === 'add to order') {
            this.productArray = [];
            this.productArr = [];
            this.selItem = [];
            this.count = 0;
            this.onlyShowroomProducts = [];
            this.hideProducts = [];
            this.unHideProducts = [];
            this.showGroupAction = false;
            this.order.items = [];
            this.form_offer.reset();
            this.filterCategory = 'all';
            this.sub = '';
            this.loadPages();
        } else if (this.showroomId) {
            this.router.navigate([`dashboard/seller/showroom/${this.showroomId}`]);
        } else {
            this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialogId}`]);
        }
    }
    onLocationBack() {
        this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialogId}`]);
    }
    onAddToCart() {
        this.modalService.open('add_offer');
        this.productArray = [];
        this.productArr = [];
        this.showGroupAction = false;
        this.selItem = [];
        this.onlyShowroomProducts = [];
        this.hideProducts = [];
        this.unHideProducts = [];
    }
    onDiscountPercentChange() {
        console.log(<FormControl> this.form_group.get('discount_percent'));
        if (this.form_group.get('discount_percent').value < 0) {
            this.form_group.get('discount_percent').setValue(0);
        }
        if (this.form_group.get('discount_percent').value > 100) {
            this.form_group.get('discount_percent').setValue(100);
        }
    }
    onDiscountPriceChange() {
        if (this.form_group_promo.get('discount_price').value < 0) {
            this.form_group_promo.get('discount_price').setValue(0);
        }
        if (this.form_group_promo.get('discount_price').value > 100) {
            this.form_group_promo.get('discount_price').setValue(100);
        }
    }
    mouseHovering(k, i) {
        this.isHovering[k] = true;
        this.hoveringItem = i;
    }
    mouseLeaving(k) {
        this.isHovering[k] = false;
    }
}
