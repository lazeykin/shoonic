import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService} from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {PaginationChangedEvent} from '../../events';
import {PaginationComponent} from '../messenger/components/pagination/pagination.component';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: 'sellerSearch.component.html',
    styleUrls: ['sellerSearch.component.css']
})

export class SellerSearch implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    productChoises: any;
    totalItems: number;
    sellers: any;
    productSearch: any;
    by_pairs: boolean = false;
    by_prepacks: boolean = false;
    noProducts: boolean = false;
    heels: any;
    sortBySelect: any;
    response: any;
    urlSearch: string = '';
    urlFilter: string = '';
    urlSort: string = '';
    sellerMe: string = '&seller=me&published=True';
    filterArray: any = [];
    sortValues: any = [];
    currentDate: any;

    isSellerMe: boolean = false;

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

    compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const genreA = a.id
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
        this.urlSearch = `?search=${this.productSearch}` + `&limit=40&offset=0`;
        var query = this.urlSearch + this.urlFilter + this.urlSort + this.sellerMe;
        this.productsService.buyerSearchProductsFilter(this.userService.getCurrentUserToken(), query).subscribe(response => {
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
    selectSortBy(filter) {
        this.urlSort = '';
        this.urlSort = filter;
        let arr = filter.split('=');
        let lastItem = arr[arr.length -1];
        this.totalItems = 1;
        this.urlSearch = `?search=${this.productSearch}` + `&limit=40&offset=0`;
        var query = this.urlSearch + this.urlSort + this.urlFilter + this.sellerMe;
        if(lastItem === 'reset') {
            this.getProducts();
        }else {
            this.productsService.buyerSearchProductsFilter(this.userService.getCurrentUserToken(), query).subscribe(response => {
                this.response = response;
                this.pagination.totalRows = this.response.count;
                this.pagination.currentPage = 1;
                this.products = this.response.results;
                console.log(this.products);
                if (this.products.length > 0) {
                    this.noProducts = false;
                } else {
                    this.noProducts = true;
                }
            });
        }

    }

    getProducts() {
        this.currentDate = new Date().getTime();
        this.urlSearch = `?search=${this.productSearch}` + `&limit=40&offset=0`;
        let query = this.urlSearch + this.urlFilter + this.urlSort + this.sellerMe;
        this.productsService.buyerSearchProducts(this.userService.getCurrentUserToken(), query).subscribe(response => {
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
    }


    ngOnInit() {
        if(location.pathname.indexOf('seller/search') > -1) {
            this.isSellerMe = true;
        }
        this.currentDate = new Date().getTime();
        this.productSearch = this.route.snapshot.paramMap.get('name');
        this.urlSearch = `?search=${this.productSearch}`;
        this.urlSort = '&ordering=-date_published';
    }
    transformDate(date): string {
        return this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    }
    productLink(id) {
        this.router.navigate(['dashboard/seller/product/', id]);
    }
    onPageChanged(info:PaginationChangedEvent) {
        this.urlSearch = `?search=${this.productSearch}`;
        let query = this.urlSearch+this.urlFilter+this.urlSort+this.sellerMe;
        this.loadPage(query, info.fetch, info.offset)
    }
    loadPage(query, limit=null, offset=0) {
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        query =  query + `&limit=${limit}&offset=${offset}`;
        console.log(query);
        this.productsService.buyerSearchProducts(this.userService.getCurrentUserToken(), query)
            .subscribe(response => {
                this.response = response;
                this.pagination.totalRows = this.response.count;
                this.products = this.response.results;
                console.log(this.products);
                if (this.products.length > 0) {
                    this.noProducts = false;
                } else {
                    this.noProducts = true;
                }
            });

    }
    onSearchChange(e) {
        this.productSearch = e;
        this.getProducts();
    }
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
}
