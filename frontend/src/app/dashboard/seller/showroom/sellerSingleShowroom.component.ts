import { FormService } from './../../../_services/form';
import {Component, OnInit, ViewChild, DoCheck} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FiltersComponent} from '../../../components/dashboard/filters/filters.component';
@Component({
  templateUrl: './sellerSingleShowroom.component.html',
  styleUrls: ['./sellerSingleShowroom.component.sass']
})
export class SellerSingleShowroomComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    products: any;
    productChoises: any;
    hideme: any = [];
    showrooms: any = [];
    singleShowroom: any = {};
    finalProduct: any = {};
    showroomId: any;
    productToMove: any;
    isLoading: boolean;
    id: number;
    currentDate: any;

    productToPush: any;

    form_group = new FormGroup({
        showroom: new FormControl({}),
        discount_price: new FormControl(null, [Validators.required]),
        discount_end_date: new FormControl(null, [Validators.required])
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
        private formService: FormService,
        private showroomService: ShowroomsService) {
    }

    ngOnInit() {
        window.scroll(0,0);
        this.currentDate = new Date().getTime();
        this.getShowroom();
    }

    addPromotion() {
        if (!this.form_group.valid ) {
            new FormService().markTouched(this.form_group)
            return;
        }
        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.id)
            .subscribe (
                data => {
                    console.log(data);
                    this.modalService.close('promo');
                    this.finalProduct = data;
                    this.finalProduct.is_bidding_allowed = false;
                    this.finalProduct.has_discount = true;
                    this.finalProduct.discount_end_date = this.form_group.controls['discount_end_date'].value;
                    this.finalProduct.discount_price = this.form_group.controls['discount_price'].value;
                    this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
                        .subscribe(
                            response => {
                                console.log(response);
                                this.getShowroom();
                            },
                            error => {
                                console.log(error);
                            }
                        )
                }
            );
    }

    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }

    addToShowroom() {
        if(!this.form_group.controls.showroom.value) {
            this.formService.markTouched(this.form_group)
            return;
        }
        this.productsService.getProduct(this.userService.getCurrentUserToken(), this.productToPush.id)
            .subscribe (
                data => {
                    console.log(data);
                    this.modalService.close('custom-modal-4');
                    this.finalProduct = data;
                    this.finalProduct.showroom_id = this.form_group.controls.showroom.value.id;
                    this.finalProduct.is_bidding_allowed = false;
                    if (this.finalProduct.is_hidden) {
                        this.finalProduct.is_hidden = false;
                    }
                    console.log(this.finalProduct);
                    this.productsService.editProduct(this.userService.getCurrentUserToken(), this.finalProduct.id, this.finalProduct)
                        .subscribe(_ => {
                            this.finalProduct = null;
                            this.getShowroom();
                        })
                }
            );
    }

    openModal(id, product) {
        this.getShowrooms();
        this.modalService.open(id);
        this.productToPush = product;
    }

    getShowrooms() {
        var query = "&limit=100&offset=0"
        this.showroomService.activeShowroomsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.showrooms = data['results'];
                },
                error => {
                    console.log(error);
                }
            )
    }
    closeModal(id: string) {
        this.modalService.close(id);
    }
    productMakePromo(id) {
        this.modalService.open('promo');
        this.id = id;
    }
    onMakeBlank(id) {
        this.productsService.getProduct(this.userService.getCurrentUserToken(), id).subscribe(data => {
            console.log(data);
            data['showroom_id'] = null;
            this.productsService.editProduct(this.userService.getCurrentUserToken(), id, data)
                .subscribe(
                    response => {
                        console.log(response);
                        this.productsService.hideProduct(this.userService.getCurrentUserToken(), response['id']).subscribe(next => {
                            console.log(next);
                            this.getShowroom();
                            }, error => {
                            console.log(error);
                        })
                        this.hideme = [];
                    }, error => {
                        console.log(error);
                    }
                )
        }, error => {
            console.log(error);
        })
    }
    productArchive(id) {
        this.productsService.archiveProduct(this.userService.getCurrentUserToken(), id).subscribe(
            data => {
                console.log(data);
                this.getShowroom();
                },
            error => {
                this.alertService.errorRegistration(error, this.form);
            });
    }

    removeFromPromo(id) {
        this.productsService.getProduct(this.userService.getCurrentUserToken(), id)
            .subscribe(data => {
                data['is_bidding_allowed'] = false;
                data['has_discount'] = false;
                delete data['discount_end_date'];
                delete data['discount_price'];
                this.productsService.editProduct(this.userService.getCurrentUserToken(), data['id'], data)
                    .subscribe(_ => {
                        this.getShowroom();
                    })
            })
    }

    updateProd() {
        this.productsService.editProduct(this.userService.getCurrentUserToken(), this.productToMove.id, this.productToMove)
                .subscribe(
                    data=> {
                        this.getShowroom();
                    }
                )
    }
    getShowroom() {
        this.isLoading = true;
        this.showroomId = this.route.snapshot.paramMap.get('id');
        this.showroomService.singleShowroom(this.userService.getCurrentUserToken(), this.showroomId)
            .subscribe(
                data => {
                    this.singleShowroom = data;
                    console.log(this.singleShowroom);
                    this.isLoading = false;
                }
            )
    }

    addProduct() {
        this.router.navigate(['/dashboard/seller/product/add/steps'], {queryParams: {id: this.showroomId}});
    }
    editShowroom(sr) {
        this.router.navigate(['dashboard/seller/showroom/edit/', sr.id]);
    }
    productEditOne(prod_id) {
        this.router.navigate(['dashboard/seller/product/edit/', prod_id], {queryParams: {id: this.showroomId}});
    }

    addProductFromCatalog() {
        this.router.navigate(['/dashboard/seller'], {queryParams: {id: this.showroomId}});
    }

    productLink(id) {
        this.router.navigate(['dashboard/seller/product/', id]);
    }

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    addToCatalog(id) {
        this.productsService.getProduct(this.userService.getCurrentUserToken(), id)
            .subscribe(
                data => {
                    this.productToMove = data;
                    delete this.productToMove.showroom_id;
                    this.updateProd();
                }
            )
    }
}
