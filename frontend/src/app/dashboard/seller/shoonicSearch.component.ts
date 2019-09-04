import { BuyerSearch } from './../buyer/buyerSearch.component';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-name',
    templateUrl: './sellerSearch.component.html',
    styleUrls: ['./sellerSearch.component.css']
})
export class ShoonicSearchComponent extends BuyerSearch implements OnInit {
    sellerSearch = true;
    ngOnInit(): void { 
        super.ngOnInit();
    }
}
