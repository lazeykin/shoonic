import {Component, OnInit, ViewChild, DoCheck} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../../_services/index';
import {Router, ActivatedRoute, RouterStateSnapshot} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FiltersComponent} from '../../../components/dashboard/filters/filters.component';
@Component({
  templateUrl: './buyerNotRegisteredShowroom.component.html',
  styleUrls: ['./buyerSingleShowroom.component.sass']
})
export class BuyerNotRegisteredShowroomComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    products: any;
    showroomId: any;
    showroom: any;
    isLoading: boolean;

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
        this.getShowroom();
    }

    getShowroom() {
        this.isLoading = true;
        this.showroomId = this.route.snapshot.paramMap.get('id');
        this.showroomService.singleShowroomNotRegistered(this.showroomId)
            .subscribe(
                data=> {
                    this.showroom = data;
                    console.log(this.showroom);
                    this.isLoading = false;
                }
            )
    }
    productLink(id) {
        let url = this.router.url;
        this.router.navigate(['dashboard/buyer/showroom/product/', id]);
    }

    register() {
        let url = this.router.url;
        this.router.navigate(['register/register-step-one'], {queryParams: {returnUrl: url}});
    }
    openModal(str) {
        this.modalService.open(str);
    }
    closeModal(str) {
        this.modalService.close(str);
    }


}