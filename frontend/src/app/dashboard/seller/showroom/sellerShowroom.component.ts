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
  selector: 'app-seller-showroom',
  templateUrl: './sellerShowroom.component.html',
  styleUrls: ['./sellerShowroom.component.sass']
})
export class SellerShowroomComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    productChoises: any;
    query: any;
    response: any;
    hideme: any = [];
    showrooms: any = [];
    isLoading: boolean = true;
    urlFilter: string = '';
    @Input() shop = false;
    shopUrl: string;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        public router: Router,
        private modalService: ModalService,
        private userService: UserService,
        private showroomService: ShowroomsService) {
    }

    ngOnInit() {
        window.scroll(0,0);
        //this.getProducts();
        this.shopUrl = this.route.snapshot.paramMap.get('shop');
        this.getShowrooms();
    }

    editShowroom(sr) {
        this.router.navigate(['dashboard/seller/showroom/edit/', sr.id]);
    }
    showroomLink(id) {
        console.log(id);
        if (!this.shop) {
            this.router.navigate(['dashboard/seller/showroom/', id]);
        } else {
            this.router.navigate([`${this.shopUrl}/showroom/`, id]);
        }
    }
    getShowrooms() { console.log('CALL IN PUBLIC')
        this.isLoading = true;
        var query = "&limit=10&offset=0";
        this.showroomService.publicShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.response = data;
                    this.showrooms = this.response.results;
                    this.isLoading = false;
                    console.log(data);
                },
                error => {
                    console.log(error);
                }
            )
    }

    archShowroom(sr) {
        this.showroomService.archiveShowroom(this.userService.getCurrentUserToken(), sr, sr.id)
            .subscribe(
                data => {
                    this.isLoading = true;
                    this.loadPages(this.urlFilter);
                }
            )
    }

    productLink(id) {
        this.router.navigate(['dashboard/seller/products/product/', id]);
    }
    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
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
        query = `&limit=${limit}&offset=${offset}` + query;
        this.showroomService.publicShowroomsPage(this.userService.getCurrentUserToken(),
            query).subscribe(response => {
            this.response = response;
            console.log(response);
            this.pagination.totalRows = this.response.count;
            this.showrooms = this.response.results;
            this.isLoading = false;

        });
    }
}
