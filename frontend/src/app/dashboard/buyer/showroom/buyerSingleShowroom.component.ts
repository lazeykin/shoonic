import {Component, OnInit, ViewChild, DoCheck, Input} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FiltersComponent} from '../../../components/dashboard/filters/filters.component';
@Component({
    selector: 'app-buyer-single-showroom',
    templateUrl: './buyerSingleShowroom.component.html',
    styleUrls: ['./buyerSingleShowroom.component.sass']
})
export class BuyerSingleShowroomComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    products: any;
    showroomId: any;
    showroom: any;
    isLoading: boolean;
    @Input() shop = false;
    shopUrl: string;
    scope: string;

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
        this.shopUrl = this.route.snapshot.paramMap.get('shop');
        const user = this.userService.getCurrentUser();
        if (user) {
            this.scope = user.scope[0];
        } else {
            this.scope = 'notRegistered';
        }
        if (!this.shop) {
            this.getShowroom();
        } else {
            this.isLoading = true;
            this.showroomId = this.route.snapshot.paramMap.get('id');
            this.showroomService.singleShowroomForVisitor(this.showroomId)
                .subscribe(
                    data => {
                        this.showroom = data;
                        console.log(this.showroom);
                        this.isLoading = false;
                    }
                )
        }
    }

    getShowroom() {
        this.isLoading = true;
        this.showroomId = this.route.snapshot.paramMap.get('id');
        this.showroomService.singleShowroom(this.userService.getCurrentUserToken(), this.showroomId)
            .subscribe(
                data => {
                    this.showroom = data;
                    console.log(this.showroom);
                    this.isLoading = false;
                }
            )
    }
    productLink(id) {
        if (!this.shop) {
            this.router.navigate(['dashboard/buyer/showroom/product/', id]);
        } else {
            this.router.navigate(['', this.shopUrl, id]);
        }
    }


}
