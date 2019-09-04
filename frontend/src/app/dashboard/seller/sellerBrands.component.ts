// import {Component, OnInit, ViewChild} from '@angular/core';
// import { User } from '../../_models/index';
// import { AlertService, ProductsService, UserService, ModalService } from '../../_services/index';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/platform-browser';
// import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
// import {Location} from '@angular/common';
// import {CustomValidator} from '../../_services/custom_validators';
// import {FormService} from '../../_services/form';

// @Component({
//     templateUrl: 'sellerBrands.component.html',
//     styleUrls: [ './sellerBrands.component.css']
// })

// export class SellerBrandsComponent implements OnInit {
//     // @ViewChild('f') public form: NgForm;
//     brands: any = [];
//     model: any = {
//         name: '',
//         sub_title: '',
//         website_address: ''
//     };
//     modelUpdate: any = {
//         id: null
//     };

//     brandsStyle = {
//         'max-height': '84px'
//     }
//     displayForm: boolean = false;
//     hideButton: boolean = false;
//     form_group = new FormGroup(
//         {
//             name: new FormControl('',
//                 [<any>Validators.required, <any>Validators.maxLength(80)]),
//             sub_title: new FormControl('',
//                 [<any>Validators.required, <any>Validators.maxLength(160)]),
//             website_address: new FormControl('',
//                 [<any>Validators.maxLength(200), <any>CustomValidator.urlValidator])
//         }
//     )


//     constructor(
//         @Inject(DOCUMENT) private document: Document,
//         private userService: UserService,
//         private location: Location,
//         private productsService: ProductsService,
//         private alertService: AlertService,
//         private modalService: ModalService) {
//     }

//     ngOnInit() {
//         console.log(this. form_group);
//         this.productsService.allBrands(this.userService.getCurrentUserToken()).subscribe(response => {
//             this.brands = response;
//         });
//         this.form_group.valueChanges.subscribe(x => {
//             // console.log('Form changed')
//             // console.log(x)
//             this.model = Object.assign({}, x)
//         });
//     }

//     addBrand () {
//         this.displayForm = true;
//     }

//     editBrand(id) {
//         this.hideButton = true;
//         this.displayForm = true;
//         this.productsService.editBrand(this.userService.getCurrentUserToken(), id).subscribe(response => {
//             this.model = response;
//             this.modelUpdate.id = this.model.id;
//             this.form_group.patchValue(this.model)

//         });
//     }

//     deleteBrand(id) {
//         this.productsService.deleteBrand(this.userService.getCurrentUserToken(), id).subscribe(response => {
//             location.reload();
//         });
//     }

//     saveBrandNew() {
//         if (!this.form_group.valid){
//             new FormService().markTouched(this.form_group)
//             return;
//         }
//         if (this.hideButton) {
//             this.productsService.updateBrand(this.model, this.modelUpdate.id, this.userService.getCurrentUserToken())
//                 .subscribe(
//                     data => {
//                         location.reload();
//                     },
//                     error => {
//                         this.alertService.errorRegistration(error, this.form_group);
//                     });
//         } else {
//             this.productsService.saveBrandNew(this.model, this.userService.getCurrentUserToken())
//                 .subscribe(
//                     data => {
//                         location.reload();
//                     },
//                     error => {
//                         this.alertService.errorRegistration(error, this.form_group);
//                     });
//         }
//     }
// }
