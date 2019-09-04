import { ShowroomsService } from './../../_services/showrooms.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_models/index';
import {AlertService, ProductsService, UserService, ModalService} from '../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import {Location} from '@angular/common';
import {PaginationChangedEvent} from '../../events';
import {PaginationComponent} from '../messenger/components/pagination/pagination.component';

@Component({
    templateUrl: 'sellerArchive.component.html',
    styleUrls: ['sellerArchive.component.css']
})

export class SellerArchiveComponent implements OnInit {
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
    finalProduct: any;
    showroomToPush: any;
    productToPush: any;
    showrooms: any = [];
    showGroupAction: boolean = false;
    groupShowroom: boolean = false;

    onlyToShowroom: boolean = false;
    onlyMakeBlank: boolean = false;
    onlyPublish: boolean = false;


    blankProducts: any = [];
    showroomProducts: any = [];
    publicProducts: any = []; 

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
        this.showroomToPush = this.form_group.controls.showroom.value.id;
       // this.productToPush.showroom_id = this.showroomToPush.id;

       console.log(this.productToPush);
        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productToPush.id)
            .subscribe (
                data => {
                    console.log(data);
                    this.modalService.close('custom-modal-4');
                    this.finalProduct = data;
                    this.finalProduct.showroom_id = this.showroomToPush;
                    this.finalProduct.is_bidding_allowed = false;
                    this.finalProduct.is_hidden = false;
                    console.log(this.finalProduct);
                    this.updateProd();
                    this.selItem = [];
                    this.productArray = [];
                    this.productArr = [];
                    this.showGroupAction = false;

                }
            );
    }

    updateProd() {
        this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
                .subscribe(
                    data=> {
                        this.undoArchive(this.productToPush.id);
                        this.pagination.currentPage = 1;
                        this.loadPages();
                        },
                        error => {
                        console.log(error);
                    }
                )
    }

    onMakeBlank(id, product) {
        if (!product.showroom_id) {
            this.productsService.hideProduct(this.userService.getCurrentUserToken(), id).subscribe(response => {
                console.log(response);
                this.undoArchive(id);
            }, error => {
                console.log(error);
            })
        } else {
                this.productsService.getProduct(this.userService.getCurrentUserToken(), id).subscribe(data => {
                    console.log(data);
                    delete data['showroom_id'];
                    this.productsService.editProduct(this.userService.getCurrentUserToken(), id, data)
                        .subscribe(
                            response => {
                                console.log(response);
                                this.productsService.hideProduct(this.userService.getCurrentUserToken(), response['id']).subscribe(next => {
                                    this.undoArchive(id);
                                    this.selItem = [];
                                    this.productArray = [];
                                    this.productArr = [];
                                    this.showGroupAction = false;
                                    console.log(next);
                                    }, error => {
                                    console.log(error);
                                })
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
                this.undoArchive(id);
                console.log(response);
                }, error => {
                console.log(error);
            })
        } else if (product.showroom_id) {
            this.productsService.getProduct(this.userService.getCurrentUserToken(), id).subscribe(data => {
                delete data['showroom_id'];
                this.productsService.editProduct(this.userService.getCurrentUserToken(), id, data)
                    .subscribe(
                        response => {
                            console.log(response);
                            this.productsService.unhideProduct(this.userService.getCurrentUserToken(), response['id']).subscribe(next => {
                                this.undoArchive(id);
                                this.selItem = [];
                                this.productArray = [];
                                this.productArr = [];
                                this.showGroupAction = false;
                                console.log(next);
                                }, error => {
                                console.log(error);
                            })
                        }, error => {
                            console.log(error);
                        }
                    )
            }, error => {
                console.log(error);
            })
        }
    }

    onFilterChenge(filter) {
        this.urlFilter = filter;
        if (this.urlFilter != '') {
            const query = `&limit=40&offset=0`;
            this.productsService.archiveFilterProductsPages(this.userService.getCurrentUserToken(), query, this.urlFilter).subscribe(response => {
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
        this.productsService.allPagesArchiveSellerProducts(this.userService.getCurrentUserToken(), query).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.pagination.currentPage = 1;
            this.products = this.response.results;
            console.log(this.totalItems)
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
        //this.getProducts();
    }

    undoArchive(id) {
        this.productsService.undoArchive(this.userService.getCurrentUserToken(), id).subscribe(
            data => {
                //location.reload();
                let offset = (this.pagination.currentPage - 1) * 12;
                this.loadPages('', 12, offset);

            },
            error => {
                this.alertService.errorRegistration(error, this.form);
            });
    }

    onPageChanged(info:PaginationChangedEvent) {
        this.loadPages(this.urlFilter, info.fetch, info.offset);
        this.selItem = [];
        window.scroll(0,0);
    }
    loadPages(query:string='', limit=null, offset=0) {
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        query = `&limit=${limit}&offset=${offset}` + query;
        this.productsService.allPagesArchiveSellerProducts(this.userService.getCurrentUserToken(),
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
        
        this.onlyToShowroom = !this.productArray.some(element => {
            return element.showroom_id
        });

        this.onlyMakeBlank = this.productArray.every(element => {
            return !element.is_hidden || element.showroom_id
        });

        this.onlyPublish = this.productArray.every(element => {
            return element.is_hidden || element.showroom_id
        });

        this.showroomProducts = this.productArray.filter(e => e.showroom_id)

        this.blankProducts = this.productArray.filter(e => e.is_hidden)

        this.publicProducts = this.productArray.filter(e => !e.is_hidden && !e.showroom_id)

        if (this.productArr.length > 0) {
            this.showGroupAction = true;
        } else {
            this.showGroupAction = false;
        }
        console.log(this.productArr, this.productArray)
        console.log('showroom: ', this.showroomProducts, 'blank: ', this.blankProducts, 'public: ', this.publicProducts)
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

    closeModal(id: string) {
        this.modalService.close(id);
    }
    getShowrooms() {
        var query = "&limit=100&offset=0"
        this.showroomService.activeShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.response = data;
                    this.showrooms = this.response.results;
                    console.log(this.response.results);
                },
                error => {
                    console.log(error);
                }
            )
    }

    onGroupUnarchive(arr) {
        let bathArr = [];
        for (let i = 0; i < arr.length; i++) {
            bathArr.push({
                "method": "DELETE",
                "path": `/api/v1/products/${arr[i].id}/archive`
            })
        }
        this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe( data => {
            this.showGroupAction = false;
            arr = [];
            this.selItem = [];
            let offset = (this.pagination.currentPage - 1) * 12;
            this.loadPages('', 12, offset);
            this.closeModal('custom-modal-4');
        }, error => {
            console.log(error);
            alert('Something went wrong! Please, refresh and try again');
        })
    }

    onGroupHide() {

        if(this.publicProducts.length) {
            let batchArr = [];
            for (let i = 0; i < this.publicProducts.length; i++) {
                console.log(this.publicProducts[i].id)
                batchArr.push({
                    "method": "POST",
                    "path": `/api/v1/products/${this.publicProducts[i].id}/hide/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                .subscribe(
                    data => {
                        this.onGroupUnarchive(this.publicProducts);
                        this.publicProducts = [];
                        this.productArr = [];
                        this.productArray = [];
                    }
                )
        }

        if(this.showroomProducts.length) {
            let batchArr = [];
            for (let i = 0; i < this.showroomProducts.length; i++) {
                batchArr.push({
                    "method": "GET",
                    "path": `/api/v1/products/${this.showroomProducts[i].id}/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                .subscribe(
                    data => {
                        let batchArr = [];
                        for (let i = 0; i < data['length']; i++)  {
                            delete data[i].data.showroom_id;
                            batchArr.push({
                                "method": "POST",
                                "path": `/api/v1/products/${data[i].data.id}/publish/`,
                                "data": data[i].data
                            })
                        }
                        this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                            .subscribe(
                                data => {
                                    let batchArr = [];
                                    for (let i = 0; i < data['length']; i++)  {
                                        batchArr.push({
                                            "method": "POST",
                                            "path": `/api/v1/products/${data[i].data.id}/hide/`
                                        })
                                    }
                                    this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                                        .subscribe(
                                            data => {
                                                this.onGroupUnarchive(this.showroomProducts);
                                                this.showroomProducts = [];
                                                this.productArr = [];
                                                this.productArray = [];
                                            }
                                        )
                                }
                            )
                    }
                )
        }

    }

    onGroupAddToShowroom() {
        this.showroomToPush = this.form_group.controls.showroom.value.id;
        let batchArr = [];
        for(let i = 0; i < this.productArray.length; i++) {
            batchArr.push({
                "method": "GET",
                "path": `/api/v1/products/${this.productArray[i].id}/`
            })
        } 
            this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                .subscribe(
                    data => {
                        let batchArr = [];
                        for (let i = 0; i < data['length']; i++)  {
                            data[i].data.showroom_id = this.showroomToPush;
                            data[i].data.is_bidding_allowed = false;
                            data[i].data.is_hidden = false;
                            batchArr.push({
                                "method": "POST",
                                "path": `/api/v1/products/${data[i].data.id}/publish/`,
                                "data": data[i].data
                            })
                        }

                        this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                            .subscribe(
                                data => {
                                    this.onGroupUnarchive(this.productArray);
                                    this.productArray = [];
                                }
                            )
                    }
                )
        }

    onGroupPublish() {
        let batchArr = [];
        for(let i = 0; i < this.productArray.length; i++) {
            batchArr.push({
                "method": "GET",
                "path": `/api/v1/products/${this.productArray[i].id}/`
            })
        } 
            this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                .subscribe(
                    data => {
                        let batchArr = [];
                        for (let i = 0; i < data['length']; i++)  {
                            delete data[i].data.showroom_id;
                            data[i].data.is_hidden = false;
                            batchArr.push({
                                "method": "POST",
                                "path": `/api/v1/products/${data[i].data.id}/publish/`,
                                "data": data[i].data
                            })
                        }
                        this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                            .subscribe(
                                data => {
                                    this.onGroupUnarchive(this.productArray);
                                    this.productArray = [];
                                }
                            )
                    }
                )
    }
    onItemMenuCall() {
        this.productArray = [];
        this.productArr = [];
        this.showGroupAction = false;
        this.selItem = [];
        this.showroomProducts = [];
        this.blankProducts = [];
        this.publicProducts = [];
    }

}
