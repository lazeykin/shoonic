import {Component, Input, OnInit, Output} from '@angular/core';
import {AlertService, UserService} from '../_services/index';
import { ModalService } from '../_services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../_services/form';
import {LanguageService} from '../_services/language.service';
import { EventEmitter } from 'protractor';

@Component({
    selector: 'footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})

export class FooterComponent implements OnInit {
    loadingSub:boolean = false;
    emailSubscribe: string;
    form_group = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    })
    model: any = {
        email: ''
    }
    languages: any = [];
    currentLanguage: string = 'en';
    @Input() isHomePage = false;

    constructor(
        private modalService: ModalService,
        private userService: UserService,
        private alertService: AlertService,
        private langService: LanguageService
    ) {}

    ngOnInit() {

        this.langService.currentLanguage.subscribe(lang => { 
            this.currentLanguage = lang;
            console.log(this.currentLanguage)
        })

        this.form_group.valueChanges.subscribe(value => {
            this.model = Object.assign({}, value)
        });
        this.langService.getLanguages().subscribe(response => {
            console.log(response);
            this.languages = response;
        }, error => {
            console.log(error);
        })
    }

    closeModal(id: string){
        this.modalService.close(id);
    }

    onSunscribe() {
        if (!this.form_group.valid){
            new FormService().markTouched(this.form_group)
            console.log('invalid');
            return;
        }
        this.loadingSub = true;
        this.userService.subscribe(this.model.email)
            .subscribe(
                data => {
                    this.modalService.open("custom-modal-1");
                },
                error => {
                    console.log("Please check for errors");
                    this.alertService.errorRegistration(error, this.form_group);
                });

    }

    selectLanguage(lang: string) {
        this.langService.changeLanguage(lang);
    }

    getCurrentLanguage() {
        let res = this.languages.find(e => {
            return e.code === this.currentLanguage;
        });
        if(res) return res.name;
    }
}
