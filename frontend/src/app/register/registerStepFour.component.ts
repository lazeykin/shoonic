import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, UserService } from '../_services/index';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {ModalService} from '../_services';

@Component({
    templateUrl: 'registerStepFour.component.html',
    styleUrls: ['../_directives/header.component.css']
})

export class RegisterStepFour implements OnInit {
    form_group = new FormGroup({
        fileToUpload: new FormControl('')
    })
    model: any = {};
    data: any = {};
    showForm = false;
    fileToUpload: File = null;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private modalService: ModalService) { }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        let returnUrl = this.router.url;
    }

    handleFileInput(files: FileList) {
        if (!(/\.(|jpg|jpeg|pdf)$/i).test(files.item(0).name)) {
            this.form_group.controls.fileToUpload.setErrors({invalidFormat: true})
        } else {
            this.fileToUpload = files.item(0);
        }
    }

    stepFour() {
        if (this.fileToUpload) {
            this.userService.uploadInvoice(this.fileToUpload, this.userService.getCurrentUserToken()).subscribe(
                data => {
                    this.data = data;
                    if (this.data.scope[0] === "seller") {
                        this.router.navigate(['/dashboard/seller']);
                    } else {
                        this.router.navigate(['/dashboard/buyer']);
                    }
                    this.userService.saveCurrentUser(this.data)
                    // localStorage.setItem('currentUser', JSON.stringify(this.data));
                },
                error => {
                    this.alertService.errorRegistration(error, this.form_group);
                });
        }
    }

}
