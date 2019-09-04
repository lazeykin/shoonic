import { TranslatePipe } from './../../../pipes/translate.pipe';
import { ProductsService } from './../../../_services/products.service';
import { FormService } from './../../../_services/form';
import { ModalService } from './../../../_services/modal.service';
import { CustomValidator } from './../../../_services/custom_validators';
import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormImagesComponent} from '../form-images/form-images.component';
import { flatMap } from 'rxjs/operators';
import { UserService } from '../../../_services';

@Component({
    selector: 'app-add-edit-product-one',
    templateUrl: './add-edit-product-one.component.html',
    styleUrls: ['./add-edit-product-one.component.css']
})
export class AddEditProductOneComponent implements OnInit {
    @Input('group') form_group: FormGroup;
    @Input() countries: any;
    @Input() sales: any;
    @Input() destinations: any;
    @Input() showrooms: any;
    @Input() edit: boolean;
    @Input() disableShowroom: boolean = false;

    styles = {
        'max-height': '84px'
    }
    emailStyle = {
        'display': 'block',
        'margin-top': '9px'
}

    model_si: any;

    form_si = new FormGroup({
        address: new FormGroup({
            zip: new FormControl('',
                [<any>Validators.required, <any>CustomValidator.zipCodeValidator, <any>Validators.maxLength(80)]),
            city: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            state: new FormControl('',
                [<any>Validators.maxLength(80)]),
            street_name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            country: new FormControl('', [<any>Validators.required]),
            street_number: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)]),
            bus: new FormControl('', [<any>Validators.maxLength(10)])
        }),
        contact_person: new FormControl('',
            [<any>Validators.maxLength(80)]),
        vat_number: new FormControl('',
            [<any>Validators.required, <any>Validators.maxLength(80)]),
        website_address: new FormControl('',
            [<any>CustomValidator.urlValidator, <any>Validators.maxLength(200)]),
        email: new FormControl('',
            [<any>Validators.maxLength(256), <any>Validators.email, <any>Validators.required]),
        phone_number: new FormControl('', [<any>Validators.maxLength(13), <any>Validators.required]),
        name: new FormControl('',
                [<any>Validators.required, <any>Validators.maxLength(80)])
    });

    toShowroom = false;
    constructor(
        private modalService: ModalService,
        private formService: FormService,
        private productsService: ProductsService,
        private userService: UserService,
        private translatePipe: TranslatePipe
    ) {
    }
    ngOnInit() {
        this.form_group.valueChanges.subscribe(value => {
            if(this.form_group.controls.destination.value) {
                console.log(this.form_group.controls.destination.value)
            if(this.form_group.controls.destination.value.id === 0) {
                this.toShowroom = true;
            }
            else {
                this.toShowroom = false;
            }
        }
        })
        this.form_si.valueChanges.subscribe(x => {
            this.model_si = Object.assign({}, x)
        })
    }

    onBgClick(id:string, e: any) {
        if(!$(e.target).closest('.modal-body').length)
            this.closeModal(id);
    }

    closeModal(id) {
        this.modalService.close(id);
        this.form_group.controls.sales_identity.setValue(null);
        this.form_si.reset();
    }

    onSelectSI(si) {
        if(si.id === 0) {
            this.modalService.open('modal-add-si');
        } else this.modalService.close('modal-add-si')
    }

    saveSI() {
        // website is ignored, missing on backend
        // street_number is mandatory, shouldn't be
        if(this.form_si.valid) {
            this.form_si.disable();
            for (var propName in this.model_si) { 
                if (this.model_si[propName] === null || this.model_si[propName] === undefined) {
                  delete this.model_si[propName];
                }
            }
            this.model_si.address.country = this.model_si.address.country.id;
                this.productsService.saveSI(this.model_si, this.userService.getCurrentUserToken())
                    .subscribe(
                        data => {
                            let name = this.translatePipe.transform('TEXT_CUSTOM');
                            this.productsService.allSI(this.userService.getCurrentUserToken()).subscribe(response => {
                                this.sales = response;
                                let created = this.sales.filter(x => x.id === data['id'])[0];
                                this.form_group.controls.sales_identity.setValue(created);
                                this.sales.unshift({
                                    id: 0,
                                    name: name
                                })
                                this.modalService.close('modal-add-si');
                                this.form_si.enable();
                                this.form_si.reset();
                           })
                        },
                        error => {
                            this.form_si.enable();
                        });
        }
        else {
            this.formService.markTouched(this.form_si);
        }
        
    }

}
