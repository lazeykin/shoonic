import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, ModalService, ProductsService, UserService} from '../../_services';
import {Router} from '@angular/router';
import {FormService} from '../../_services/form';
import {CustomValidator} from '../../_services/custom_validators';

@Component({
  selector: 'app-web-shop',
  templateUrl: './web-shop.component.html',
  styleUrls: ['./web-shop.component.sass']
})
export class WebShopComponent implements OnInit {
  form_group = new FormGroup({
    webshop_name: new FormControl(''),
    new_webshop_url: new FormControl(null, [Validators.required, CustomValidator.hasSpace, CustomValidator.matchAdress]),
    webshop_banner: new FormControl(null),
    webshop_url: new FormControl(null),
    url_attached_to_the_banner: new FormControl(null, [Validators.maxLength(200), CustomValidator.urlValidator])
  });
  model: any = {};
  personalInfo: any = {};
  webSiteInfo: any = {};
  message: boolean = false;

  constructor(
      private productsService: ProductsService,
      private userService: UserService,
      private router: Router,
      private alertService: AlertService,
      private modalService: ModalService
  ) { }

  ngOnInit() {
    console.log(this.form_group);
    this.form_group.valueChanges.subscribe(value => {
      this.model = Object.assign({}, value);
      console.log(this.model);
    });
    this.form_group.controls.webshop_banner.valueChanges.subscribe(x => {
      if (x !== null && x !== undefined && x.type) {
        this.sendLogo(x);
      }
    });
    this.getWebShop();
  }

  onSendShop() {
    if (!this.form_group.valid) {
      new FormService().markTouched(this.form_group);
      return;
    }
      this.userService.createWebShop(this.userService.getCurrentUserToken(), this.model).subscribe( response => {
        console.log(response);
        this.message = false;
        this.modalService.open('custom-modal-5');
        this.getWebShop();
      }, error => {
        console.log(error);
        this.alertService.errorRegistration(this.form_group);
        this.form_group.get('new_webshop_url').setErrors(this.form_group.get('webshop_url').errors);
      })
  }
  sendLogo(file) {
    this.productsService.uploadImage(file, this.userService.getCurrentUserToken()).subscribe(
        data => {
          this.model.webshop_banner = data;
          this.form_group.controls.webshop_banner.setValue(data);
        },
        error => {
          console.log(error);
        });

  }
  onPreview() {
    if (this.webSiteInfo.webshop_url) {
      this.router.navigate(['', this.model.webshop_url]);
    } else {
      this.message = true;
      return
    }

  }
  getWebShop() {
    this.userService.getPersonalInfo(this.userService.getCurrentUserToken()).subscribe( data => {
      console.log(data);
      this.personalInfo = data;
      this.form_group.get('new_webshop_url').patchValue(this.personalInfo.company.name);
      // new FormService().markTouched(this.form_group);
      this.form_group.get('new_webshop_url').updateValueAndValidity();
      this.userService.getWebShop(this.userService.getCurrentUserToken(), this.personalInfo.webshop_url).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
        this.form_group.patchValue(this.webSiteInfo);
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    })
  }
  onDeleteShop() {
    if (this.model.webshop_url) {
      this.userService.deleteWebShop(this.userService.getCurrentUserToken()).subscribe(data => {
        console.log(data);
        location.reload();
      }, error => {
        console.log(error);
      })
    }
  }
  closeModal(id) {
    this.modalService.close(id);
  }

}
