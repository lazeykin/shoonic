import {Component, OnInit, ViewChild, DoCheck} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FiltersComponent} from '../../../components/dashboard/filters/filters.component';
import {PaginationChangedEvent} from '../../../events';
import {PaginationComponent} from '../../messenger/components/pagination/pagination.component';
@Component({
  templateUrl: './sellerShowroomArchive.component.html',
  styleUrls: ['./sellerShowroomArchive.component.sass']
})
export class SellerShowroomArchiveComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    productChoises: any;
    query: any;
    response: any;
    hideme: any = [];
    isLoading: boolean = true;
    showrooms: any = [];
    noShowrooms: boolean = false;
    urlFilter: string = '';

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
        this.getShowrooms();
    }
     showroomLink(id) {
        console.log(id);
        this.router.navigate(['dashboard/seller/showroom/', id]);
    }

    unarchiveShowroom(id) {
        this.showroomService.unarchiveShowroom(this.userService.getCurrentUserToken(), id)
            .subscribe(
                data => {
                    this.isLoading = true;
                    this.loadPages(this.urlFilter);
                    
                }
            )
    }

    editShowroom(sr) {
        this.router.navigate(['dashboard/seller/showroom/edit/', sr.id]);
    }
    getShowrooms() {
        this.isLoading = true;
        var query = "&limit=10&offset=0";
        this.showroomService.archivedShowroomsPage(this.userService.getCurrentUserToken(), query)
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
            );
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
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        console.log(limit);
        console.log(offset);
        query = `&limit=${limit}&offset=${offset}` + query;
        this.showroomService.archivedShowroomsPage(this.userService.getCurrentUserToken(),
            query).subscribe(response => {
                console.log(response);
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.showrooms = this.response.results;
            this.isLoading = false;

        });
    }

}