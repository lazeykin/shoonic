import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService, UserService} from '../../_services';
import {SocketService} from '../../_services/socket.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.sass']
})
export class ChangeEmailComponent implements OnInit {
  token: string;
  showForm = false;
  errorMessage = false;

  constructor(
      private router: Router,
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private socketService: SocketService
  ) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.socketService.userUnLogged();
    const returnUrl = this.router.url;
    this.token = returnUrl.replace('/core/confirm-email-change/','');
    console.log(this.token);
    this.userService.checkTokenInEmailChanging(this.token).subscribe(response => {
      console.log(response);
      this.showForm = true;
      this.errorMessage = false;
    }, error => {
      console.log(error);
      this.showForm = false;
      this.errorMessage = true;
    })
  }
  onLogIn() {
    this.router.navigate(['/login']);
  }
}
