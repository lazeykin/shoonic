import {Component, OnInit, ViewChild, DoCheck, Input} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {PaginationChangedEvent} from '../../../events';
import {PaginationComponent} from '../../messenger/components/pagination/pagination.component';
import {FiltersComponent} from '../../../components/dashboard/filters/filters.component';
@Component({
  selector: 'app-buyer-showroom-private',
  templateUrl: './buyerShowroom.component.html',
  styleUrls: ['./buyerShowroom.component.sass']
})
export class BuyerShowroomPrivateComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    totalItems: number;
    isFiltered: boolean;
    sortBySelect: any = '&ordering=-date_published';
    response: any;
    showrooms: any = [];
    isLoading: boolean;
    urlFilter: string;
    @Input() shop = false;
    shopUrl: string;
    innerWidth: number;

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

    ngOnInit() {
        window.scroll(0,0);
        this.innerWidth = window.innerWidth;
        if (!this.shop) {
            this.getShowrooms();
        } else {
            this.shopUrl = this.route.snapshot.paramMap.get('shop');
            this.showroomService.specificSellerPrivateShowrooms(this.userService.getCurrentUserToken(), this.shopUrl, 'limit=10&offset=0').
                subscribe(response => {
                    console.log(response);
            }, error => {
                   console.log(error);
            })
        }
    }

    showroomLink(id) {
        this.router.navigate(['dashboard/buyer/showroom/', id]);
    }
    getShowrooms() {
        this.isLoading = true;
        if (!this.shop) {
            var query = "?limit=10&offset=0";
            this.showroomService.allShowroomsPage(this.userService.getCurrentUserToken(), query)
                .subscribe(
                    data => {
                        console.log(data);
                        this.pagination.totalRows = this.response.count;
                        this.showrooms = this.response['results'];
                        this.isLoading = false;
                    },
                    error => {
                        console.log(error);
                    }
                )
        } else {
            this.showroomService.specificSellerPrivateShowrooms(this.userService.getCurrentUserToken(), this.shopUrl, 'limit=10&offset=0').
            subscribe(response => {
                console.log(response);
                this.pagination.totalRows = this.response.count;
                this.showrooms = this.response['results'];
                this.isLoading = false;
            }, error => {
                console.log(error);
            })
        }
    }

    productLink(id) {
        this.router.navigate(['dashboard/seller/products/product/', id]);
    }

  
    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    onPageChanged(info:PaginationChangedEvent) {
        this.isLoading = true;
        this.loadPages(this.urlFilter, info.fetch, info.offset);
        console.log(info.fetch, info.offset);
        window.scroll(0,0);
    }
    loadPages(query:string='', limit=null, offset=0) {
        if(this.route.snapshot.queryParams.page > 0) {
            offset = this.route.snapshot.queryParams.page * 10 - 10;
            
        }
        console.log("OFFSET ", offset);
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        console.log(limit);
        console.log(offset);
        if (!this.shop) {
            query = `?limit=${limit}&offset=${offset}` + this.sortBySelect;
            this.showroomService.allShowroomsPage(this.userService.getCurrentUserToken(),
                query).subscribe(response => {
                this.response = response;
                console.log(response);
                this.pagination.totalRows = this.response.count;
                this.showrooms = this.response['results'];
                console.log(this.pagination);
                console.log(this.showrooms);
                this.isLoading = false;

            });
        } else {
            query = `limit=${limit}&offset=${offset}` + this.sortBySelect;
            this.showroomService.specificSellerPrivateShowrooms(this.userService.getCurrentUserToken(), this.shopUrl, query).
            subscribe(response => {
                console.log(response);
                this.response = response;
                this.pagination.totalRows = this.response.count;
                this.showrooms = this.response['results'];
                this.isLoading = false;
            }, error => {
                console.log(error);
            })
        }
    }

    selectSortBy(filter) {
        this.sortBySelect = filter;
        console.log(filter);
        console.log(this.urlFilter)
        let arr = filter.split('=');
        let lastItem = arr[arr.length - 1];
        this.totalItems = 1;

        if (lastItem === 'reset') {
            this.getShowrooms();
        } else {
            this.loadPages('', null, 0);
        }
    }
}
