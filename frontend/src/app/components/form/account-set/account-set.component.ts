import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BuyerAccountComponent, SellerAccountComponent} from '../../../dashboard';
import {ProductsService, UserService} from '../../../_services';

@Component({
  selector: 'app-account-set',
  templateUrl: './account-set.component.html',
  styleUrls: ['./account-set.component.css']
})
export class AccountSetComponent implements OnInit {
    @Input('group') form_group: FormGroup;
  model: any = {
      photo: '',
      first_name: '',
      last_name: '',
      email: ''
  }
    
    _data: any;
    @Input() set data(data: any) {
        console.log(data)
        if (data !== undefined)
        {
            this._data = data;
            this.form_group.patchValue(this._data);
        }
    }

    styles = {
        'margin-bottom': '24px'
    }
  constructor(
      private router: Router,
      private buyerAccountComponent: BuyerAccountComponent,
      private productsService: ProductsService,
      private sellerAccountComponens: SellerAccountComponent,
      private userService: UserService,
  ) { }

  ngOnInit() {
       this.data =  this.buyerAccountComponent.getPersonalInfo();
        console.log(this.form_group);
        this.form_group.valueChanges.subscribe(value => {
            this.model = Object.assign({}, value);
            console.log(this.model);
    });
      this.form_group.controls.photo.valueChanges.subscribe(x => {
          if (x !== null && x !== undefined && x.type) {
              this.sendLogo(x);
          }
      });
  }
    sendLogo(file) {
        this.productsService.uploadImage(file, this.userService.getCurrentUserToken()).subscribe(
            data => {
                this.model.logo = data;
                this.form_group.controls.photo.setValue(data);
            },
            error => {
                console.log(error);
            });

    }

    editPersonalInfo() {
      if (this.router.url === '/dashboard/buyer/account') {
            this.buyerAccountComponent.editPersonalInfo(this.model);
      } else if (this.router.url === '/dashboard/seller/account') {
          this.sellerAccountComponens.editPersonalInfo(this.model);
      }
    }

  
}
