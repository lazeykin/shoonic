import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { AlertService, ProductsService, ModalService, UserService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {PaginationChangedEvent} from '../../events';
import {PaginationComponent} from '../messenger/components/pagination/pagination.component';

@Component({
    templateUrl: 'searchVisitor.component.html',
    styleUrls: ['../../_directives/header.component.css', 'searchVisitor.component.css']
})

export class SearchVisitorComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    searchInput: string;
    products: any;
    productChoises: any;
    sellers: any;
    totalItems: number;
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
    urlSelector: string = '';
    filterArray: any = [];
    sortValues: any = [];
    currentDate: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private alertService: AlertService) {
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

    onFilterChenge(filter) {
        this.urlFilter = filter;
        this.urlSearch = `?search=${this.productSearch}`;
        var query = this.urlSearch + this.urlFilter + this.urlSort + `&limit=40&offset=0`;
            this.productsService.visitorSearchProductsPagesFiltered(query).subscribe(response => {
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

    selectSortBy(filter) {
        this.urlSort = '';
        this.urlSort = filter;
        let arr = filter.split('=');
        let lastItem = arr[arr.length - 1];
        this.totalItems = 1;
        this.urlSearch = `?search=${this.productSearch}`;
        var query = this.urlSearch + this.urlSort + this.urlFilter + `&limit=40&offset=0`;
        if (lastItem === 'reset') {
            this.getProducts();
        } else {
            this.productsService.visitorSearchProductsPagesFiltered(query).subscribe(response => {
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
    }

    getProducts(isCleaeFilter?: boolean) {
        this.currentDate = new Date().getTime();
        if (isCleaeFilter) {
            this.urlFilter = `?search=${this.productSearch}&ordering=-date_created`;
        }
        this.urlSearch = `?search=${this.productSearch}`;
        let query = this.urlSearch + this.urlFilter + this.urlSort +  `&limit=40&offset=0`;
        this.productsService.visitorSearchProductsPages(query).subscribe(response => {
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
        this.currentDate = new Date().getTime();
        this.productSearch = this.route.snapshot.paramMap.get('name');
        this.urlSearch = `?search=${this.productSearch}`;
        this.urlSort = '&ordering=-date_published';
    }

    searchV(search) {
        this.urlSearch = `?search=${search}`;
        let query = this.urlSearch+this.urlFilter+this.urlSort
        console.log(query);
        this.userService.searchVisitor(query)
            .subscribe(
                data => {
                    this.router.navigate(['/search', search]);
                    this.userService.setSearchVisitor(data);
                    this.productSearch = search;
                    this.getProducts();
                },
                error => {
                    console.log('Please check for errors')
                    console.log(error)
                });
    }

    productLink() {
        this.modalService.open('custom-modal-2');
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
    onPageChanged(info:PaginationChangedEvent) {
        window.scroll(0,0)
        this.loadPage(this.urlSearch + this.urlFilter + this.urlSort, info.fetch, info.offset)
    }
    loadPage(query, limit=null, offset=0) {
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        query =  query + `&limit=${limit}&offset=${offset}`;
        console.log(query);
        this.productsService.visitorSearchProductsPages(query)
            .subscribe(response => {
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
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
}
