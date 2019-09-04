import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from '../../_models/index';
import { AlertService, ProductsService, UserService, ModalService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {NgForm} from '@angular/forms';

@Component({
    templateUrl: 'sellerPrepacks.component.html',
    styleUrls: ['sellerPrepacks.sass']
})

export class SellerPrepacksComponent implements OnInit {
    @ViewChild('f') public form: NgForm;

    prepacks: any = [];
    outputSizes: any = [];
    sizes: any =  {
     "": "",
    };

    model: any = {};
    displayForm: boolean = false;
    hideButton: boolean = false;

    constructor(        
    	@Inject(DOCUMENT) private document: Document,
     	private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private alertService: AlertService,
    	private userService: UserService) {
    }

    ngOnInit() {
        this.productsService.allSellerPrepacks(this.userService.getCurrentUserToken()).subscribe(response => {
           this.prepacks = response;
        });
        this.outputSizes = Object.entries(this.sizes).map(([key, value]) => ({key,value}));
    }

    addPrepack () {
        this.displayForm = true;
    }

    editPrepack(id) {
        this.hideButton = true;
        this.displayForm = true;
        this.productsService.editPrepack(this.userService.getCurrentUserToken(), id).subscribe(response => {
            this.model = response;
            this.outputSizes = Object.entries(this.model.sizes).map(([key, value]) => ({key,value}));
            this.outputSizes = this.outputSizes.sort(function(a: any, b: any) {
                return (+a.key) - (+b.key);
            });
        });
    }

    deletePrepack(id) {
        this.productsService.deletePrepack(this.userService.getCurrentUserToken(), id).subscribe(response => {
            location.reload();
        });
    }


    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
    savePrepack () {
        this.model.sizes = this.outputSizes.reduce((acc, cur) => ({ ...acc, [cur.key]: Number(cur.value) }), {});
        if (this.hideButton) {
            this.productsService.updatePrepack(this.model, this.model.id, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        location.reload();
                    },
                    error => {
                        this.alertService.errorRegistration(error, this.form);
                    });
        } else {
            this.productsService.saveNewPrepack(this.model, this.userService.getCurrentUserToken())
                .subscribe(
                    data => {
                        console.log(data);
                        location.reload();
                    },
                    error => {
                        this.alertService.errorRegistration(error, this.form);
                    });
        }


    }

    addPrepackSizes() {
        this.outputSizes.push({
            key: "", value: ""
        });
    }

    removePrepackSizes(index) {
        this.outputSizes.splice(index,1);
    }
}
