import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, UserService } from '../_services/index';

@Component({
    templateUrl: 'registerFree.component.html',
    styleUrls: ['../_directives/header.component.css']
})

export class RegisterFree implements OnInit {
    model: any = {};
    loading = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private userService: UserService) { }

    ngOnInit() {}

    setSeller() {
        this.userService.getUserType("seller");
    };
    setBuyer() {
        this.userService.getUserType("buyer");
    };
}
