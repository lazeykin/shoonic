import {Component, OnInit, ViewChild, DoCheck} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FiltersComponent} from '../../../components/dashboard/filters/filters.component';
import {PaginationChangedEvent} from '../../../events';
import {PaginationComponent} from '../../messenger/components/pagination/pagination.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sellers-catalog',
  templateUrl: './sellers-catalog.component.html',
  styleUrls: ['./sellers-catalog.component.css']
})
export class SellersCatalogComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    productChoises: any;
    query: any;
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
    sortValues: any = [];
    prepacksQuantity: any = [];
    modalProduct: any;
    displayErorQuantity: boolean = false;
    displayErorPrepackQuantity: boolean = false;
    items: any = [];
    addItimes: any = {};
    cartInfoData: any = [];
    cartInfo: any = [];
    currentDate: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private alertService: AlertService,
        private datePipe: DatePipe,
        private userService: UserService) {
    }

    ngOnInit() {
        window.scroll(0,0);
        this.urlSort = '&ordering=-date_published';
        this.currentDate = new Date().getTime();
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
        var query = `&limit=40&offset=0` + this.urlFilter + this.urlSort;
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
        const query = `&limit=40&offset=0` + this.urlFilter + this.urlSort;
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

    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }


    getProducts() {
        this.currentDate = new Date().getTime();
        //this.urlFilter = '&ordering=-date_published';
        this.productsService.buyerProductsPage(this.userService.getCurrentUserToken(), `&limit=40&offset=0` + this.urlSort+this.urlFilter).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.products = this.response.results;
            this.pagination.currentPage = 1;
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
        this.router.navigate(['dashboard/seller/products/product/', id]);
    }

    openModal(productId) {
        this.displayErorQuantity = false;
        this.displayErorPrepackQuantity = false;
        this.productsService.getProduct(this.userService.getCurrentUserToken(), productId).subscribe(response => {
            this.modalProduct = response;
            this.modalService.open("custom-modal-product");
            if (this.modalProduct.sizes) {
                // this.displaySizes = true;
                this.modalProduct.sizes = Object.entries(this.modalProduct.sizes).map(([key, value]) => ({key,value}));
            }
            if (this.modalProduct.prepacks){
                for ( let i=0; i < this.modalProduct.prepacks.length; i++) {
                    this.modalProduct.prepacks[i].sizes = Object.entries(this.modalProduct.prepacks[i].sizes).map(([key, value]) => ({key,value}));
                }

            }
        });
    }

    closeModal(id: string) {
        this.modalProduct = "";
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
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
}
