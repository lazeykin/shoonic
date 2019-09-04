import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../../_services';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.sass']
})
export class SingleProductComponent implements OnInit {
  personalInfo: any = {};
  webSiteInfo: any = {};
  scope: string;
  shop: string;
  @ViewChild('banner') banner: ElementRef;
  imgHeight: number;
  innerWidth: number;

  constructor(
      private userService: UserService,
      private location: Location,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    const user = this.userService.getCurrentUser();
    if(user) {
      this.scope = user.scope[0];
    } else {
      this.scope = 'notRegistered';
    }
    this.shop = this.route.snapshot.paramMap.get('shop');
    if (this.scope === 'buyer') {
      this.userService.getWebShop(this.userService.getCurrentUserToken(), this.shop).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
      }, error => {
        console.log(error);
      });
    }
    if (this.scope === 'seller') {
      this.getWebShop();
    }
    if (this.scope === 'notRegistered') {
      this.userService.getWebShopForVisitor(this.shop).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
      }, error => {
        console.log(error);
      });
    }
  }
  getWebShop() {
    this.userService.getPersonalInfo(this.userService.getCurrentUserToken()).subscribe( data => {
      console.log(data);
      this.personalInfo = data;
      this.userService.getWebShop(this.userService.getCurrentUserToken(), this.personalInfo.webshop_url).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    })
  }
  onBack() {
   // this.location.back();
    switch(this.scope) {
      case 'buyer':
        this.router.navigate(['/dashboard/buyer']);
        break
      case 'seller':
        this.router.navigate(['dashboard/seller']);
        break
      default:
        this.router.navigate(['/'])
    }
  }
  onEdit() {
    this.router.navigate(['/dashboard/my-shop'])
  }
  onLoad() {
    const imgHeight = (this.banner.nativeElement as HTMLImageElement).height;
    this.imgHeight = imgHeight - 175;
  }
}
