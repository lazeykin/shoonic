import { LanguageService } from './../_services/language.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';
import {UserService, ProductsService, AlertService, AuthenticationService} from '../_services/index';
import { Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {ModalService} from '../_services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../_services/form';
import { isPlatformBrowser } from '@angular/common';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    searchInput: string;
    loadingSub = false;
    products: any = [];
    form_group = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    })
    model: any = {
        email: ''
    }
    isShowSubscribe: boolean = true;
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private modalService: ModalService,
        private productService: ProductsService,
        private alertService: AlertService,
        private langService: LanguageService,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        
    }

    ngOnInit() {
        if (this.authenticationService.getRememberStatus()) {
            const userInfo = this.userService.getCurrentUser();
            switch (userInfo.scope[0]) {
                case 'buyer':
                    this.router.navigate(['/dashboard/buyer']);
                    break
                case 'seller':
                    this.router.navigate(['/dashboard/seller'])
                    break
            }
        }
        this.bestSellers();
        this.form_group.valueChanges.subscribe(value => {
            this.model = Object.assign({}, value)
        })
    }
    bestSellers() {
        this.productService.getBestSellers().subscribe((data: any) => this.products = data.results)

    }
   
    setSeller() {
        this.userService.getUserType("seller");
    }
    setBuyer() {
        this.userService.getUserType("buyer");
    }
    closeModal(id: string){
        this.modalService.close(id);
    }
    onSunscribe() {
        if (!this.form_group.valid){
            new FormService().markTouched(this.form_group)
            console.log('invalid');
            return;
        }
        this.loadingSub = true;
        this.userService.subscribe(this.model.email)
            .subscribe(
                data => {
                    this.modalService.open("custom-modal-1");
                },
                error => {
                    console.log("Please check for errors");
                    this.alertService.errorRegistration(error, this.form_group);
                });

    }

    searchV() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('visitor', 'true');
        }
        this.userService.searchVisitor(this.searchInput)
            .subscribe(
                data => {
                    this.router.navigate(['/search', this.searchInput]);
                    this.userService.setSearchVisitor(data);
                },
                error => {
                    console.log("Please check for errors")
                });

    }
}
