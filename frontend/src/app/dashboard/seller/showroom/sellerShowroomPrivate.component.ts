import { PaginationComponent } from './../../messenger/components/pagination/pagination.component';
import { PaginationChangedEvent } from './../../../events/index';
import { AlertService } from './../../../_services/alert.service';
import { FormBuilder } from '@angular/forms';
import { ModalService } from './../../../_services/modal.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { ProductsService } from './../../../_services/products.service';
import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { SellerShowroomComponent } from './sellerShowroom.component';
import { UserService, ShowroomsService } from '../../../_services';

@Component({
    selector: 'app-seller-showroom-private',
    templateUrl: './sellerShowroom.component.html',
    styleUrls: ['./sellerShowroom.component.sass']
})
export class SellerShowroomPrivateComponent implements OnInit {
    @ViewChild(PaginationComponent) pagination;
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute,
        public router: Router,
        private modalService: ModalService,
        private userService: UserService,
        private showroomService: ShowroomsService
    ){
    }
    isLoading: boolean = false;
    showrooms: any = [];
    urlFilter: '';
    @Input() shop = false;
    ngOnInit(): void {
        window.scroll(0,0);
        this.getShowrooms();
    }

    getShowrooms() { console.log('CALL IN PRIVATE')
        this.isLoading = true;
        var query = "&limit=10&offset=0";
        this.showroomService.privateShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.showrooms = data['results'];
                    this.isLoading = false;
                    console.log(data);
                },
                error => {
                    console.log(error);
                }
            )
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
        this.showroomService.privateShowroomsPage(this.userService.getCurrentUserToken(),
            query).subscribe(response => {
            this.pagination.totalRows = response['count'];
            this.showrooms = response['results'];
            this.isLoading = false;

        });
    }

    editShowroom(sr) {
        this.router.navigate(['dashboard/seller/showroom/edit/', sr.id]);
    }
    showroomLink(id) {
        console.log(id);
        this.router.navigate(['dashboard/seller/showroom/', id]);
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

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

}
