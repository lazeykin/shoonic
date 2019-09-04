import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, UserService } from '../_services/index';

@Component({
    templateUrl: 'registerStepTree.component.html',
    styleUrls: ['../_directives/header.component.css', 'registerStepThree.component.sass']
})

export class RegisterStepTree implements OnInit {
    model: any = {};
    data: any = {};
    showForm = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        let returnUrl = this.router.url;
        this.model.token = returnUrl.replace("/core/confirm-email/",'');
        this.confirmEmail(this.model.token);
    }
    stepFour() {
        // this.router.navigate(['/register/register-step-four']);
        this.router.navigate(['/login']);
        // todo: move
        this.userService.saveCurrentUser(this.data)
        // localStorage.setItem('currentUser', JSON.stringify(this.data.token));
    }
    confirmEmail(token) {
        this.userService.confirmEmail(token)
            .subscribe(
                data => {
                    this.data = data;
                    this.showForm = true;
                },
                error => {
                    this.alertService.errorLogin(error);
                    this.showForm = false;
                });
    }
}
