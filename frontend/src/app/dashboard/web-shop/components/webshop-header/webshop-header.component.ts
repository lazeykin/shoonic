import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductsService, UserService} from '../../../../_services';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-webshop-header',
  templateUrl: './webshop-header.component.html',
  styleUrls: ['./webshop-header.component.sass']
})
export class WebshopHeaderComponent implements OnInit {
  @Input() sortValuesTranslated: any = [];
  @Input() singleProduct = false;
  @Output() passFilter = new EventEmitter<string>();
  @Output() passQuery = new EventEmitter<string>();
  searchInput = '';
  name = '';
  scope = '';
  innerWidth: number;

  constructor(
      private productsService: ProductsService,
      private route: ActivatedRoute,
      public router: Router,
      private userService: UserService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
    this.name = this.route.snapshot.paramMap.get('shop');
    let user = this.userService.getCurrentUser();
    if(user) {
      this.scope = user.scope[0];
    } else {
      this.scope = 'notRegistered';
    }
  }
  cartQuntity () {
    return this.productsService.getCartItemsQuantity();
  }
  onSortByChange(e) {
    this.passFilter.emit(e);
  }
  searchProduct() {
    if (this.singleProduct) {
      this.router.navigate(['', this.name], {queryParams: {search: this.searchInput}})
      return
    }
    this.passQuery.emit(this.searchInput);
  }
  onClearSearch() {
    this.searchInput = '';
    this.searchProduct();
  }
  toCatalog() {
    this.router.navigate(['', this.name])
  }
  toCart() {
    if (this.scope === 'seller') {
      return
    } else {
      this.router.navigate(['/dashboard/buyer/cart'])
    }
  }
}
