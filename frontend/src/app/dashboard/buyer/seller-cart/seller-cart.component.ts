import { Component, OnInit } from '@angular/core';
import {ProductsService, UserService} from '../../../_services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-seller-cart',
  templateUrl: './seller-cart.component.html',
  styleUrls: ['./seller-cart.component.sass']
})
export class SellerCartComponent implements OnInit {
  user: any;
  scope: string;
  sellers_cart_id: string;
  cartInfo: any = [];
  addItimes: any = {
    items: []
  };
  cartInfoData: any = [];
  options: any = {
      items: []
  };

  constructor(
      private userService: UserService,
      private productsService: ProductsService,
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit() {
    this.user =  this.userService.getCurrentUser();
    console.log(this.user);
    this.sellers_cart_id = this.route.snapshot.paramMap.get('id');
    if (this.user) {
      this.scope = 'buyer';
      this.productsService.getSellerCart( this.userService.getCurrentUserToken(), this.sellers_cart_id).subscribe( response => {
        console.log(response);
        this.addItimes = response;
        for (let i = 0; i < this.addItimes.items.length; i++) {
          delete this.addItimes.items[i].id;
          this.addItimes.items[i].product_id = this.addItimes.items[i].product.id;
          if (this.addItimes.items[i].prepack) {
            this.addItimes.items[i].prepack_id = this.addItimes.items[i].prepack.id;
          }
        }
        this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
            data => {
              this.cartInfo = data;
              console.log(this.cartInfo);
              if (this.cartInfo.length === 0) {
                this.productsService.createNewCart(this.userService.getCurrentUserToken(), {"items": this.addItimes.items}).subscribe(
                    data => {
                      this.cartInfoData = data;
                      this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                      this.router.navigate(['/dashboard/buyer/cart']);
                    },
                    error => {
                      console.log(error);
                    });
              } else {
                this.productsService.addItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, {"items": this.addItimes.items}).subscribe(
                    data => {
                      this.cartInfoData = data;
                      this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                      this.router.navigate(['/dashboard/buyer/cart']);
                    },
                    error => {
                      console.log(error);
                    });
              }
            },
            error => {
              console.log(error);
            })
      }, error => {
        console.log(error);
      })

    } else {
      this.scope = 'notRegistered';
      this.productsService.getSellerCartVisitor(this.sellers_cart_id).subscribe( data => {
        console.log(data);
        this.options = data;
      }, error => {
        console.log(error);
      })
    }
  }

}
