import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {ProductsService, UserService} from '../../../_services/index';
import { ModalService } from '../../../_services/index';
import { Location } from '@angular/common';
import { BuyerSingleProductComponent } from '../buyerSingleProduct.component';

@Component({
    templateUrl: '../buyerSingleProduct.component.html',
    styleUrls: ['../buyerSingleProduct.component.css']
})

export class BuyerShowroomProductComponent extends BuyerSingleProductComponent implements OnInit {
    showroomBidding = true;

    ngOnInit() {
        super.ngOnInit();
    }
}
