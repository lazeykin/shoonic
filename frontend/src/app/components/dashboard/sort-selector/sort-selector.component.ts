import { TranslatePipe } from './../../../pipes/translate.pipe';
import {Component, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';
import { LanguageService } from '../../../_services/language.service';


@Component({
    selector: 'app-sort-selector',
    templateUrl: 'sort-selector.component.html',
    styleUrls: ['sort-selector.component.css']
})

export class SortSelectorComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    productChoises: any;
    noProducts: boolean = false;
    searchInput: string;
    heels: any;
    sortBySelect: any;
    response: any;
    urlFilter: string;
    productSearch: any;
    pageNumber: any;
    // filterArray: any = [];
    sortValues: any = [];
    sortValuesTranslated: any = [];
    @Input() showroom: boolean = false;
    @Output() filter = new EventEmitter<string>();
    @Input() shop = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private translatePipe: TranslatePipe,
        private langService:LanguageService,
        private userService: UserService,
        private alertService: AlertService) {
    }


    passToParent() {
        this.filter.emit(this.urlFilter);
    }

    selectSortBy() {
        this.urlFilter = '&ordering=' + this.sortBySelect;
        this.passToParent();
    }

    translateValues() {
        this.sortValuesTranslated = this.sortValues.map(x => Object.assign({}, x)).map(e => {
            e.label = this.translatePipe.transform(e.label);
            return e;
        })
        if(this.sortValuesTranslated.some(e => {return e.label == undefined})) {
            setTimeout(this.translateValues.bind(this), 500);
        }
        else return this.sortValuesTranslated;
    }

    ngOnInit() {
        this.productSearch = this.route.snapshot.paramMap.get('name');
        // this.urlFilter = '?search=' + this.productSearch;
        if(this.showroom) {
            this.sortValues = [
                {label: 'SORTBY_NEWEST', id: '-date_created'},
                {label: 'SORTBY_OLDEST', id: 'date_created'},
                {label: 'SORTBY_RECENTLY_MODIFIED', id: '-date_modified'},
                {label: 'SORTBY_LATER_MODIFIED', id: 'date_modified'},
                // {label: 'SORTBY_WITHOUT', id: 'reset'}
            ]
        }
        else {
            this.sortValues = [
                {label: 'SORTBY_HIGH_PRICE', id: '-price'},
                {label: 'SORTBY_LOW_PRICE', id: 'price'},
                {label: 'SORTBY_NEWEST', id: '-date_published'},
                {label: 'SORTBY_OLDEST', id: 'date_published'},
                // {label: 'SORTBY_PROMO', id: '-date_published&has_discount=true'},
                // {label: 'SORTBY_WITHOUT', id: 'reset'}
            ];
        }
        // fix for default value
        if(this.showroom)
            this.sortBySelect = '-date_created'
        else
            this.sortBySelect = '-date_published'

        this.langService.currentLanguage.subscribe(lang => {
            setTimeout(this.translateValues.bind(this), 2000);
        })
    }

}
