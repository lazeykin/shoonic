import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {PaginationChangedEvent} from '../../events';
import {PaginationComponent} from '../messenger/components/pagination/pagination.component';

@Component({
    templateUrl: 'sellerDrafts.component.html',
    styleUrls: ['sellerDrafts.component.css']
})

export class SellerDraftsComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    productChoises: any;
    totalItems: number;
    sellers: any;
    by_pairs: boolean = false;
    by_prepacks: boolean = false;
    noProducts: boolean = false;
    heels: any;
    response: any;
    myForm: FormGroup;
    urlFilter: string;
    filterArray: any = [];
    selItem: any = [];
    productArr: any = [];
    productArray: any = [];
    showGroupAction: boolean = false;
    count: number;
    currentDate: any;
    detailProduct: any = null;
    id: any = null;
    showrooms: any = [];
    showroomToPush: any = {};
    productToPush: any = {};
    finalProduct: any = {};
    hideme: any = [];
    productsGet: any = [];
    errorArray: any = [];
    array: any = [];
    filterCategory: string = 'all';
    isFilterMenuOpened: boolean = false;
    groupShowroom = false;


    form_group = new FormGroup({
        showroom: new FormControl({})
    });

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
        private showroomService: ShowroomsService
    ) { }

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


    onFilterChenge(filter) {
        this.urlFilter = filter;
        if (this.urlFilter != '') {
            const query = `&limit=40&offset=0`;
            this.productsService.allDraftsSellerProductsPages(this.userService.getCurrentUserToken(), query, this.urlFilter).subscribe(response => {
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


    getProducts() {
        const query = `&limit=40&offset=0`;
        this.productsService.allSellerDraftsPages(this.userService.getCurrentUserToken(), query).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.pagination.currentPage = 1;
            this.products = this.response.results;
            console.log(this.products)
            if (this.products.length > 0) {
                this.noProducts = false;
            } else {
                this.noProducts = true;
            }
            this.products.sort(this.compare);
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
        this.urlFilter = '';
        this.currentDate = new Date().getTime();
        this.getShowrooms();

        let self = this;
        $(window).click(function () {
            self.isFilterMenuOpened = false;
        });
        $('.filter-menu').click(function (event) {
            event.stopPropagation();
        });

    }

    productLink(id) {
        this.router.navigate(['dashboard/seller/product/', id]);
    }

    productEditOne(id) {
        this.router.navigate(['dashboard/seller/product/edit/', id]);
    }
    onGoEdit() {
        this.router.navigate(['dashboard/seller/product/edit/', this.id, {data: 'badPublish'}]);
    }
    openModal(id, product) {
        this.modalService.open(id);
        this.productToPush = product;
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
    onPublish(id) {
        this.productsService.getProduct(this.userService.getCurrentUserToken(), id).subscribe(response => {
            console.log(response);
            this.detailProduct = response;
            this.productsService.editProduct(this.userService.getCurrentUserToken(), id, this.detailProduct).subscribe(data => {
                console.log(data);
                let offset = (this.pagination.currentPage - 1) * 40;
                this.loadPages('', 40, offset);
            }, error => {
                console.log(error);
                this.id = id;
                this.modalService.open('custom-modal-bad-publishing');

            })
        }, error => {
            console.log(error);
        })
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
    onPageChanged(info:PaginationChangedEvent) {
        this.loadPages(this.urlFilter, info.fetch, info.offset);
        window.scroll(0,0);
    }
    loadPages(query:string='', limit=null, offset=0) {
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        query = `&limit=${limit}&offset=${offset}` + query;
        this.productsService.allSellerDraftsPages(this.userService.getCurrentUserToken(),
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
    onSelectedItem(id, selectValue, product) {
        if(selectValue) {
            this.productArr.push(id);
            this.productArray.push(product);
        } else {
            let index = this.productArr.indexOf(id);
            this.productArr.splice(index, 1);
            this.productArray.splice(index, 1);
        }
        console.log(this.productArr);
        console.log(this.productArray);
        if (this.productArr.length > 0) {
            this.showGroupAction = true;
        } else {
            this.showGroupAction = false;
        }
        this.count = this.productArr.length;
    }
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
    getShowrooms() {
        var query = "&limit=100&offset=0"
        this.showroomService.activeShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.response = data;
                    this.showrooms = this.response.results;
                },
                error => {
                    console.log(error);
                }
            )
    }
    addToShowroom() {
        this.showroomToPush = this.form_group.controls.showroom.value;
        this.id = this.productToPush.id;
        console.log(this.productToPush);
        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productToPush.id)
            .subscribe (
                data => {
                    console.log(data);
                    this.modalService.close('modal-to-showroom');
                    this.finalProduct = data;
                    this.finalProduct.showroom_id = this.showroomToPush.id;
                    this.finalProduct.is_bidding_allowed = false;
                    if (this.finalProduct.is_hidden) {
                        this.finalProduct.is_hidden = false;
                    }
                    console.log(this.finalProduct);
                    this.updateProd();
                }, error => {
                    console.log(error);
                }
            );
    }
    updateProd() {
        this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
            .subscribe(
                data=> {
                    let offset = (this.pagination.currentPage - 1) * 40;
                    this.loadPages('', 40, offset);
                },
                error => {
                    console.log(error);
                    this.modalService.open('custom-modal-bad-publishing');
                }
            )
    }
    onMakeBlank(id, product) {
            this.productsService.hideProduct(this.userService.getCurrentUserToken(), id).subscribe(response => {
                console.log(response);
                this.hideme = [];
                let offset = (this.pagination.currentPage - 1) * 40;
                this.loadPages('', 40, offset);
            }, error => {
                console.log(error);
            })

    }
    onGroupHide() {
            let bathArr = [];
            for (let i = 0; i < this.productArray.length; i++) {
                bathArr.push({
                    "method": "POST",
                    "path": `/api/v1/products/${this.productArray[i].id}/hide/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),  {"operations": bathArr}).subscribe( data => {
                console.log(data);
                this.showGroupAction = false;
                this.productArray = [];
                this.productArr = [];
                this.selItem = [];
                let offset = (this.pagination.currentPage - 1) * 25;
                this.loadPages('', 25, offset);
            }, error => {
                console.log(error);
                alert('Something went wrong! Please, refresh and try again');
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
    onGroupPublish() {
            let bathArr = [];
            for (let i = 0; i < this.productArray.length; i++) {
                bathArr.push({
                    "method": "GET",
                    "path": `/api/v1/products/${this.productArray[i].id}`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),  {"operations": bathArr}).subscribe( data => {
                console.log(data);
                this.productsGet = data;
                bathArr = [];
                for (let i = 0; i < this.productArray.length; i++) {
                    bathArr.push({
                        "method": "POST",
                        "path": `/api/v1/products/${this.productArray[i].id}/publish/`,
                        "data": this.productsGet[i].data
                    })
                }
                this.productsService.batch(this.userService.getCurrentUserToken(),  {"operations": bathArr})
                    .subscribe( response => {
                        console.log(response);
                        this.errorArray = response;
                        console.log(this.errorArray);
                        this.array = Object.assign([], this.productArray);
                        this.productArray = [];
                        this.productArr = [];
                        this.showGroupAction = false;

                        this.selItem = [];
                        let offset = (this.pagination.currentPage - 1) * 25;
                        this.loadPages('', 25, offset);
                    }, error => {
                        console.log(error);
                    })

            }, error => {
                console.log(error);
                alert('Something went wrong! Please, refresh and try again');
            })
    }
    filterProductCategory(type, e: Event) {
        this.isFilterMenuOpened = !this.isFilterMenuOpened;
        let target = e.target;
        $(target).parent().prependTo('.filter-menu ul');
        this.router.navigate(['dashboard/seller', {filterCategory: type}])
    }
    onItemMenuCall() {
        this.productArray = [];
        this.productArr = [];
        this.showGroupAction = false;
        this.selItem = [];
    }

    // addToShowroom() {
    //     this.showroomToPush = this.form_group.controls.showroom.value;
    //     this.id = this.productToPush.id;
    //     console.log(this.productToPush);
    //     this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productToPush.id)
    //         .subscribe (
    //             data => {
    //                 console.log(data);
    //                 this.finalProduct = data;
    //                 this.modalService.close('modal-to-showroom');
    //                 this.updateProd();
    //             }, error => {
    //                 console.log(error);
    //             }
    //         );
    // }
    // updateProd() {
    //     this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
    //         .subscribe(
    //             data => {
    //                 let offset = (this.pagination.currentPage - 1) * 12;
    //                 this.loadPages('', 12, offset);
    //                 this.finalProduct = data;
    //                 this.finalProduct.showroom_id = this.showroomToPush.id;
    //                 this.finalProduct.is_bidding_allowed = false;
    //                 if (this.finalProduct.is_hidden) {
    //                     this.finalProduct.is_hidden = false;
    //                 }
    //                 console.log(this.finalProduct);
    //                 this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct).subscribe(response => {
    //                     console.log(response);
    //                     let offset = (this.pagination.currentPage - 1) * 12;
    //                     this.loadPages('', 12, offset);
    //                 }, error => {
    //                     console.log(error);
    //
    //                 })
    //
    //             },
    //             error => {
    //                 console.log(error);
    //                 this.modalService.open('custom-modal-bad-publishing');
    //             }
    //         )
    // }
}
