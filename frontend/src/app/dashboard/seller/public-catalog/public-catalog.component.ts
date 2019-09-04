import { BuyerComponent } from './../../buyer/buyer.component';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-seller-public-catalog',
    templateUrl: '../../buyer/buyer.component.html',
    styleUrls: ['../../buyer/buyer.component.css']
})
export class SellerPublicCatalogComponent extends BuyerComponent implements OnInit {

    viewAsSeller = true;
    
    ngOnInit(): void {
        super.ngOnInit();
        
    }
}
