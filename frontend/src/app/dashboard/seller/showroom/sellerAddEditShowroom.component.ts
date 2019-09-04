import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService, ShowroomsService, MessengerService} from '../../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {FormService} from '../../../_services/form';
//import {FiltersComponent} from '../../components/dashboard/filters/filters.component';
import {PaginationChangedEvent} from '../../../events';
import {PaginationComponent} from '../../messenger/components/pagination/pagination.component';
import {OneImageShowroomComponent} from '../../../components/form/one-image-showroom/one-image-showroom.component';
import {SellerComponent} from '../seller.component'

@Component({
    templateUrl: 'sellerAddEditShowroom.component.html',
    styleUrls: ['sellerAddEditShowroom.component.sass'],
})

export class SellerAddEditShowroomComponent implements OnInit {
    @ViewChild(OneImageShowroomComponent) child: OneImageShowroomComponent;
    @ViewChild('f') public form: NgForm;
    @ViewChild(PaginationComponent) pagination;
    products: any;
    productChoises: any;
    sellers: any;
    is_loading: boolean;
    by_pairs: boolean = false;
    by_prepacks: boolean = false;
    noProducts: boolean = false;
    totalItems: number;
    heels: any;
    response: any;
    currentPage: number;
    query: string;
    myForm: FormGroup;
    urlFilter: string;
    hideme: any = [];
    filterArray: any = [];
    productArr: any = [];
    productArray: any = [];
    count: number;
    showGroupAction: boolean = false;
    selItem: any = [];
    showroom: any = {};
    sr_id: number;
    selected_products: any = [];
    selectItems: boolean = false;
    createNew: boolean;
    addContact: boolean;
    photo: any = {};
    contact_groups: any = [];
    edit = false;
    showroomId: any;
    btnDisabled = false;
    productId: any;
    contactId: any;
    selected_contacts: any = [];
    contact_list: any = [];
    contact_length: number;
    selected_contact: any = [];
    duplicates: boolean = false;
    emptyShowroom: boolean = false;


    filterCategory: string = 'all';
    isFilterMenuOpened: boolean = false;
    showroomTitle: string = '';
    isPrivate: boolean = false;
    

    form_group = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
        is_private: new FormControl(false),
        description: new FormControl('', [Validators.maxLength(360)]),
        photo: new FormControl({}),
        initial_product_ids: new FormControl([]),
        shared_contact_groups_ids: new FormControl([]),
        shared_users_ids: new FormControl([])
    });

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private fb: FormBuilder,
        private location: Location,
        private alertService: AlertService,
        private userService: UserService,
        private showroomService: ShowroomsService,
        private messengerService: MessengerService) {
    }

    onSelectedItem(id, selectValue, product) {
        if(selectValue) {
            this.productArr.push(id);
            this.productArray.push(product);
        } else {
            let index = this.productArr.indexOf(id);
            this.productArr.splice(index, 1);
            this.productArray.splice(index, 1);
        }

        if (this.productArr.length > 0) {
            this.showGroupAction = true;
        } else {
            this.showGroupAction = false;
        }
        this.count = this.productArr.length;
    }
    filterProductCategory(type, e) {
        this.isFilterMenuOpened = !this.isFilterMenuOpened;
        this.filterCategory = type;
        if (e) {
            let target = e.target;
            $(target).parent().prependTo('.filter-menu ul');
        }
        this.onFilterChenge(''); 
    }
    getProductId(id) {
        this.productId = id;
        this.selected_products.push(id.toString());
        this.createNew = false;
    }

    getContactId(id) {
        this.contactId = id;
        this.showroom.shared_contact_groups_ids.push(id.toString());
        this.addContact = false;
    }
    checkChecked(id) {
        if(this.selected_products.indexOf(id) !== -1) {
            return true;
        }
    }
    submitForm() {
        this.form_group.controls['is_private'].setErrors(null);
        if(this.form_group.controls.name.value.length > 80){
            this.form_group.controls['name'].setErrors({'maxLength': true});
            return false;
        }
        else if (!this.form_group.controls.name) {
            this.form_group.controls['name'].setErrors({'required': true});
            return false;;
        }
        else {
            this.showroom.name = this.form_group.controls.name.value;
        }
        if(this.form_group.controls.description.value.length > 360){
            this.form_group.controls['description'].setErrors({'maxLength': true});
            return false;
        }
        else {
            this.showroom.description = this.form_group.controls.description.value;
        }
        if(this.form_group.controls.photo.value.id) {
            this.showroom.photo = Object.assign({}, this.form_group.controls.photo.value)
        }
        else {
            this.showroom.photo = null
        }
        if(this.checkForDuplicates(this.contact_list)) {
            this.duplicates = true;
            new FormService().markTouched(this.form_group);
            return;
        }
        else {
            this.duplicates = false;
        }
        if (!this.form_group.valid) {
            new FormService().markTouched(this.form_group);
            return;
        }
        console.log(this.contact_list)
        this.showroom.shared_contact_groups_ids = this.showroom.shared_contact_groups_ids.concat(this.contact_list.map(a => a.id.toString()));
        this.showroom.shared_contact_groups_ids = this.showroom.shared_contact_groups_ids.filter(function(e){
            return e != null || e != undefined;
        })
        
        if(this.form_group.controls.shared_users_ids.value.length === 0) {
            this.showroom.shared_users_ids = [];
        }
        else {
            this.showroom.shared_users_ids = this.form_group.controls.shared_users_ids.value;
        }

        this.showroom.is_private = this.form_group.controls.is_private.value;

        if(!this.showroom.is_private) {
            this.showroom.shared_contact_groups_ids = [];
            this.showroom.shared_users_ids = [];
        }
        
        if(!this.edit) {
            let batchArr = [];
            for (let i = 0; i < this.selected_products.length; i++) {
                if(this.selected_products[i].is_hidden) {
                    batchArr.push({
                        "method": "DELETE",
                        "path": `/api/v1/products/${this.selected_products[i].id}/hide`,
                    })
                }
            }
            if (batchArr.length) {
                this.productsService.batch(this.userService.getCurrentUserToken(), {"operations": batchArr})
                .subscribe(_ => {
                    this.showroom.initial_product_ids = this.showroom.initial_product_ids.concat(this.selected_products).map(e => e.id.toString());
                    this.addShowroom();
                    window.sessionStorage.clear();
                })
            }
            else {
                console.log(this.selected_products)
                console.log(this.showroom.initial_product_ids)
                this.showroom.initial_product_ids = this.showroom.initial_product_ids.concat(this.selected_products).map(e => {
                        if (e.id) {
                            return  e.id.toString()
                        } else {
                            return e
                        }

                }
                   );
                this.addShowroom();
                window.sessionStorage.clear();
            }
        }
        console.log(this.showroom);
    }

    addFromCatalog() {
        this.getProducts();
        this.count = 0;
        window.scroll(0,0);
        this.showroomTitle = this.form_group.controls.name.value;
        this.selectItems = true;
    }

    onFilterChenge(filter) {
        this.urlFilter = filter;
        var query = `&limit=40&offset=0` + this.urlFilter;
        if (this.urlFilter != '' || this.filterCategory) {
            this.productsService.sellerFilterProducts(this.userService.getCurrentUserToken(), query, this.filterCategory).subscribe(response => {
                this.response = response;
                this.pagination.totalRows = this.response.count;
                this.pagination.currentPage = 1;
                this.products = this.response.results;
                this.count = 0;
                this.productArr = [];
                this.productArray = [];
                this.selItem = [];
                if (this.products.length > 0) {
                    this.noProducts = false;
                } else {
                    this.noProducts = true;
                }
            });
        } else {
            this.getProducts();
        }
    }

    getProducts() {
        this.urlFilter = '';
        this.productsService.sellerProductPage(this.userService.getCurrentUserToken(), this.urlFilter).subscribe(response => {
            this.response = response;
           this.pagination.totalRows = this.response.count;
            this.pagination.currentPage = 1;
            this.products = this.response.results;
            if (this.products.length > 0) {
                this.noProducts = false;
            } else {
                this.noProducts = true;
            }

            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].sizes) {
                    this.products[i].allSizes = Object.keys(this.products[i].sizes);
                } else if (this.products[i].prepacks) {
                    let array1 = [];
                    for (let j = 0; j < this.products[i].prepacks.length; j++) {
                        let allSizes = Object.keys(this.products[i].prepacks[j].sizes[0]);
                        array1 = array1.concat(allSizes);
                    }
                    this.products[i].allSizes = array1;
                }
            }
        });
    }
    addNew() {
        window.scroll(0,0);
        this.createNew = true;
    }
    addContactGroup() {
        if(this.selected_contacts.length > this.selected_contact.length) {
            this.emptyShowroom = true;
        }
        else {
            this.emptyShowroom = false;
            this.selected_contacts.push(null);
        }
        //this.selected_contact = this.selected_contacts;
        this.selected_contact = Object.assign([], this.contact_list);
    }

    checkForDuplicates(arr) {    
        var temp = arr.filter((item, index, self) => index === self.findIndex((t) => t.id == item.id))
        return !(temp.length === arr.length);
    }
    

    filterContacts(items) {
        return items.filter(c => this.contact_list.indexOf(c) === -1);
    }
    selectContactGroup(i) {
        console.log(this.selected_contact[i]);
        if(this.contact_list[i]) {
            this.contact_list.splice(i, 1, this.selected_contact[i]);
        }
        else {
            this.contact_list.push(this.selected_contact[i]);
        }
        console.log(this.contact_list);
    }
    removeContactGroup(i) {
        this.contact_list.splice(i, 1);
        this.selected_contact.splice(i, 1);
        this.selected_contacts.splice(i, 1);
        console.log(this.contact_list);
    }
    compareTech(t1, t2): boolean {
        return t1 && t2 ? t1.id === t2.id : t1 === t2;
    }
    createContactGroup() {
        window.scroll(0,0);
        window.sessionStorage.setItem("unsavedForm", JSON.stringify(
            {
                name: this.form_group.controls.name.value,
                description: this.form_group.controls.description.value,
                photo: this.form_group.controls.photo.value,
                products: this.selected_products,
                shared_contact_groups_ids: this.form_group.controls.shared_contact_groups_ids.value,
                shared_users_ids: this.form_group.controls.shared_users_ids.value,
                selected_contacts: this.selected_contacts,
                selected_contact: this.selected_contact,
                contact_list: this.contact_list,
                is_private: this.form_group.controls.is_private.value
            }
        ));
        this.router.navigate(['dashboard/messenger/group/add'], {queryParams: {showroom: true}});
    }
    addShowroom() {
        setTimeout(() => {
            this.form_group.disable()
        },0)
        this.showroomService.createShowroom(this.userService.getCurrentUserToken(), this.showroom)
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigate(['dashboard/seller/showrooms']);
                },
                error => {
                    this.form_group.enable();
                    console.log(error);
                }
            )
    }

    getSelectedOptions() { 
        return this.products.filter(opt => opt.checked)
    }

    sendChecked() {
        var selected = [];
        selected = Object.assign(selected, this.productArray);
        //selected = selected.map(a => a.id.toString());
        for (let i = 0; i < selected.length; i++) {
            if(this.selected_products.indexOf(selected[i].id) === -1) {
                this.selected_products.push(selected[i]);
            }
        }
        this.modalService.open('custom-modal-3');
        console.log(this.selected_products);
        this.form_group.controls.photo.setValue(this.photo);
        //this.selectItems = false;
    }
    getContactGroups() {
        var query = "?limit=100&offset=0"
        this.showroomService.getContactGroupsPage(this.userService.getCurrentUserToken(), query)
            .subscribe(
                data => {
                    this.response = data;
                    this.contact_groups = this.response.results;
                    console.log(this.response);     
                }
            )
    }
    ngOnInit() {

        this.form_group.valueChanges.subscribe(value => {
            this.isPrivate = value.is_private;
        })
        this.showroom.initial_product_ids = [];
        this.showroom.shared_contact_groups_ids = [];
        var contact = this.route.snapshot.queryParams.id;
        console.log(this.selected_contacts);
        this.selected_contacts = this.selected_contacts.filter(function(e){
            return e != null || e != undefined;
        })
        var form = JSON.parse(window.sessionStorage.getItem("unsavedForm"));
        if(form) {
            this.form_group.controls.name.setValue(form.name);
            this.form_group.controls.description.setValue(form.description);
            this.form_group.controls.photo.setValue(form.photo);
            this.form_group.controls.is_private.setValue(form.is_private);
            this.selected_products = form.products;
            console.log(this.selected_products);
            if(form.selected_contacts.length > 0) {
                this.selected_contacts = [];
                this.selected_contacts = this.selected_contacts.concat(form.selected_contacts);
            }
            if(form.selected_contact.length > 0) {
                this.selected_contact = [];
                this.selected_contact = this.selected_contact.concat(form.selected_contact);
            }
            if(form.contact_list) {
                this.contact_list = [];
                this.contact_list = this.contact_list.concat(form.contact_list);
            }
            if(!contact) {
                this.selected_contacts.splice(-1,1);
                this.selected_contact.splice(-1,-1);
            }
            else {
                this.messengerService.getSpecificGroup(this.userService.getCurrentUserToken(), contact).subscribe(
                    data => {
                        console.log(data);
                        this.contact_list.push(data);
                        const index = this.selected_contacts.findIndex(item => item === null);
                        this.emptyShowroom = false;
                        this.selected_contacts.splice(index, 1, data)
                        this.selected_contact.push(data);
                        console.log(this.selected_contact)
                    }
                )
                //this.contact_list.push(contactToPush);
                console.log(this.contact_list);
            }
            this.form_group.controls.shared_contact_groups_ids.setValue(form.shared_contact_groups_ids);
            this.form_group.controls.shared_users_ids.setValue(form.shared_users_ids);
            console.log(this.selected_contact);
        }
        this.addContactGroup();
        // this.selected_contacts.push(contact);
        this.urlFilter = '';
        this.form_group.controls.photo.valueChanges.subscribe(x => {
            if (x !== null && x !== undefined && x.type) {
                this.sendLogo(x);
            }
        });

        this.getContactGroups();
    }
      sendLogo(file) {
          this.productsService.uploadImage(file, this.userService.getCurrentUserToken()).subscribe(
              data => {
                  console.log(data);
                  this.photo = data;
                  this.form_group.controls.photo.setValue(data);
                  console.log(this.form_group.controls.photo)
              },
              error => {
                  console.log(error);
              });
  
      }
  
    onPageChanged(info:PaginationChangedEvent) {
        this.loadPages(this.urlFilter, info.fetch, info.offset);
        window.scroll(0,0);
    }
    openModal(id) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
        this.selectItems = false;
    }

    onBgClick(id:string, e: any) {
        if(!$(e.target).closest('.modal-body').length)
            this.closeModal(id);
    }

    loadPages(query:string='', limit=null, offset=0) {
        console.log(query);
        if (limit == null) {
            limit = this.pagination.pageSize
        }
        console.log(limit);
        console.log(offset);
        query = `&limit=${limit}&offset=${offset}` + query;
        this.productsService.sellerProductPage(this.userService.getCurrentUserToken(),
            query).subscribe(response => {
            this.response = response;
            this.pagination.totalRows = this.response.count;
            this.products = this.response.results;
            if (this.products.length > 0) {
                this.noProducts = false;
            } else {
                this.noProducts = true;
            }

        });
    }

    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > Date.now();
    }

}
