import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, UserService } from '../_services/index';

@Component({
    templateUrl: 'subcribeSucess.component.html',
    styleUrls: ['../login/restorePassword.component.css']
})

export class SubcribeSucessComponent implements OnInit {
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
        this.model.token = returnUrl.replace("/core/confirm-subscription",'');
        this.confirmSubscription(this.model.token);
    }
    stepFour() {
        this.router.navigate(['/']);
    }
    confirmSubscription(token) {
        this.userService.confirmSubscription(token)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(data);
                    this.showForm = true;
                },
                error => {
                    this.alertService.errorLogin(error);
                    this.showForm = false;
                });
    }
}
