import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../_services/form';
import {AlertService, AuthenticationService, ModalService, UserService} from '../../_services';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.sass']
})
export class TokenComponent implements OnInit {
  form_group = new FormGroup({
    password: new FormControl(null, [Validators.required])
  });
  model: any = {};
  userInfo: any = {};
  constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private alertService: AlertService,
      private modalService: ModalService
  ) { }

  ngOnInit() {
    this.form_group.valueChanges.subscribe(value => {
      this.model = Object.assign({}, value)
    })
  }
  onCreateToken() {
    if (!this.form_group.valid) {
      new FormService().markTouched(this.form_group)
      return;
    }
    this.authenticationService.generateNewToken(this.userService.getCurrentUserToken(), this.model).subscribe(response => {
      console.log(response);
      this.modalService.open('token-info');
      this.userInfo = response;
    }, error => {
      console.log(error);
      this.alertService.errorRegistration(error, this.form_group);
    })
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  onCopyToken(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
