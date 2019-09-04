import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-shop-showroom',
  templateUrl: './shop-showroom.component.html',
  styleUrls: ['./shop-showroom.component.sass']
})
export class ShopShowroomComponent implements OnInit {
  scope: string;
  shop: string;
  webSiteInfo: any = {};
  personalInfo: any = {};
  @ViewChild('banner') banner: ElementRef;
  largeImage: boolean = false;
  middleImage: boolean = false;
  smallImage: boolean = false;
  imgHeight: number;
  innerWidth: number;

  constructor(
      private userService: UserService,
      private route: ActivatedRoute,
      private location: Location,
      private router: Router
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
        this.shop = this.webSiteInfo.webshop_url;
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    })
  }
  onBack() {
    //this.location.back();
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
