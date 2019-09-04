import { LanguageService } from './../_services/language.service';
import { TranslatePipe } from './../pipes/translate.pipe';
import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {AuthenticationService, UserService} from '../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {ModalService, ProductsService} from '../_services';
import {Message} from "../_models";
import {SocketService} from "../_services/socket.service";
import { NotificationModel } from '../_models/notification';
import {Subscription} from 'rxjs/internal/Subscription';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    scope: string;
    unread_messages_count: number;
    searchInput: string;
    url: string;
    dataUser: any = {};
    cartInfo: any = [];
    query: string = '';

    isNotificationWindowOpened: boolean = false;
    notificationMsg: any;
    areNotificationsNotRead: boolean = false;
    notifications: any = [];

    searchOptions: any = [
        {id: 0, name: "SEARCH_CATALOG"},
        {id: 1, name: "SEARCH_SHOONIC"}
    ];
    messages: any = [
        ['zip:processed', 'NOTIF_ZIP_PROCESSED'],
        ['product:moved_to_blank', 'NOTIF_PRODUCT_MOVED_BLANK'],
        ['product:moved_to_catalog', 'NOTIF_PRODUCT_MOVED_CATALOG'],
        ['product:moved_to_showroom', 'NOTIF_PRODUCT_MOVED_SHOWROOM'],
        ['product:rejected', 'NOTIF_PRODUCT_REJECTED'],
        ['product:approved', 'NOTIF_PRODUCT_APPROVED'],
        ['dialog:new', 'NOTIF_NEW_DIALOG'],
        ['order:rejected', 'NOTIF_ORDER_REJECTED'],
        ['order:approved', 'NOTIF_ORDER_APPROVED'],
        ['order:changed', 'NOTIF_ORDER_CHANGED'],
        ['order:new', 'NOTIF_NEW_ORDER']
    ];

    searchOptionsTranslated: any = []
    searchOption: any = 0;
    dialog_id: any;

    public cartItems: any = [];
    public cartQuantity: number;
    @Output() passQuery = new EventEmitter<string>();
    @Output() openModalRegister = new EventEmitter();
    private subscription: Subscription

    constructor(
    	 public router: Router,
         private modalService: ModalService,
         private productsService: ProductsService,
         private location: Location,
         private userService: UserService,
         private translatePipe: TranslatePipe,
         private langService: LanguageService,
    	 private socketService: SocketService,
         private authenticationService: AuthenticationService,
         @Inject(PLATFORM_ID) private platformId: any
    ) {
        this.cartQuntity();
    }

    getNotificationLink(notif) {
        if (notif.type === 'order:rejected' || notif.type === 'order:approved'
            || notif.type === 'order:changed' || notif.type === 'order:new') {
            this.productsService.getOrderInfo(this.userService.getCurrentUserToken(), notif.subject_id).subscribe( response => {
                console.log(response);
                const data = response;
                this.dialog_id = data['dialog_id'];
                switch(notif.type) {
                    case 'order:rejected':
                        this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialog_id}`]);
                        break;
                    case 'order:approved':
                        this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialog_id}`]);
                        break;
                    case 'order:changed':
                        this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialog_id}`]);
                        break;
                    case 'order:new':
                        this.router.navigate([`dashboard/messenger/orders/dialog/${this.dialog_id}`]);
                        break;
                }
            }, error => {
                console.log(error);
            });
        }
        switch(notif.type) {
            case 'zip:processed':
                this.router.navigate(['dashboard/messenger/upload-history']);
                break;
            case 'product:moved_to_blank':
                this.router.navigate([`dashboard/seller/product/${notif.subject_id}`]);
                break;
            case 'product:moved_to_catalog':
                this.router.navigate([`dashboard/seller/product/${notif.subject_id}`]);
                break;
            case 'product:moved_to_showroom':
                this.router.navigate([`dashboard/seller/product/${notif.subject_id}`]);
                break;
            case 'product:rejected':
                this.router.navigate(['dashboard/seller']);
                break;
            case 'product:approved':
                this.router.navigate(['dashboard/seller']);
                break;
            case 'dialog:new':
                this.router.navigate([`dashboard/messenger/products/dialog/${notif.subject_id}`]);
                break;
            default:
                this.router.navigate(['dashboard/seller']);
                break;
        }
    }

    readNotifications() {
        if(this.isNotificationWindowOpened) {
            setTimeout(() => {
                this.userService.markNotificationsAsRead(this.userService.getCurrentUserToken())
                    .subscribe(
                        data => {
                            this.getNotificationList();
                        }
                    )
            }, 1500);
        }
    }
    reloadNotifications() {
        this.subscription = this.userService.getMe(this.userService.getCurrentUserToken()).subscribe(
            (user_info:any) => {
                console.log(`reloadNotifications`)
                console.log(user_info)
                if(user_info) {
                this.unread_messages_count = user_info.notifications.unread_messages_count
                }
                return
            }
        )

    }

    getNotificationList() {
        this.userService.getNotifications(this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.notifications = data['results'];
                    this.areNotificationsNotRead = this.notifications.some((e) => !e.is_read)
                    console.log(this.areNotificationsNotRead);

                }
            )
    }
    
    translateValues() {
        this.searchOptionsTranslated = this.searchOptions.map(x => Object.assign({}, x)).map(e => {
            e.name = this.translatePipe.transform(e.name);
            return e;
        })
        if(this.searchOptionsTranslated.some(e => {return e.name == undefined})) {
            setTimeout(this.translateValues.bind(this), 500);
        }
        else return this.searchOptionsTranslated;
    }

    ngOnInit() {
        this.notificationMsg = new Map(this.messages);
        this.getNotificationList();
        console.log(this.messages)
        console.log(this.notificationMsg)
        //notification window
        let self = this;
        $(window).click(function (event) {
            if( event.target !== $('.notification-wrapper')[0] &&
                event.target !== $('.notifications img')[0] &&
                event.target !== $('.notification-wrapper h3')[0]){
                self.isNotificationWindowOpened = false;
            }
        });  

        this.langService.currentLanguage.subscribe(lang => {
            setTimeout(this.translateValues.bind(this), 1000);
        })
        if(location.pathname.indexOf('products/search') > -1) {
            this.searchOption = 1;
        }
        var user = this.userService.getCurrentUser();
        if(user) {
            this.scope = user.scope[0];
            this.unread_messages_count = user.notifications.unread_messages_count
        }
        else {
            this.scope = 'notRegistered';
        }

        this.reloadNotifications()
        console.log(`scope ${this.scope}`)
        this.userService.getPersonalInfo(this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    this.dataUser = data;
                    if (this.dataUser.photo) {
                        this.url = this.dataUser.photo.url;
                    }
                },
                error => {
                    console.log(error);
                });

        this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
            data => {
                this.cartInfo = data;
                if (this.cartInfo[0]) {
                    console.log(this.cartInfo)
                    this.productsService.getCartInfo(this.userService.getCurrentUserToken(), this.cartInfo[0].id)
                        .subscribe(
                        data => {
                            this.cartItems = data;
                            this.cartQuantity = this.cartItems.items.length;
                            this.productsService.setCartItemsQuantity(this.cartItems.items.length);
                        });
                }
            });
        
        this.socketService.onNewMessage.subscribe((new_msg:Message) => {
            if (new_msg) {
                if (this.userService.getCurrentUser().user.id !== new_msg.sender.id) {
                    this.unread_messages_count += 1
                }
            }
        })
        this.socketService.onDialogMarkRead.subscribe((dialog_id:number) => {
            if (dialog_id) {
                this.reloadNotifications()
            }
        })

        this.socketService.onNewNotification.subscribe((notif: NotificationModel) => {
            if(notif) {
                this.getNotificationList();
                if(this.isNotificationWindowOpened) {
                    this.readNotifications();
                }
            }
        })
    }

    // onAddProduct() {
    //     this.router.navigate(['/dashboard/seller/product/add'])
    // }
    cartQuntity () {
        return this.productsService.getCartItemsQuantity();
    }

    orderQuntity () {
        return this.productsService.getCartItemsQuantity();
    }

    searchBuyer() {
        this.userService.search(this.searchInput, this.query, this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    // location.reload();
                    this.router.navigate(['/dashboard/buyer/search', this.searchInput]);
                    this.userService.setSearchVisitor(data);
                    this.passToParent();
                },
                error => {
                    console.log("Please check for errors")
                });

    }
    searchVisitor(e) {
        e.preventDefault();
        this.passToParent();
    }
    passToParent() {
        this.passQuery.emit(this.searchInput);
    }
    searchSeller() {  
        if(this.router.url !== '/dashboard/seller/products') {
            this.query = "&seller=me"
        }
        console.log('query: ', this.query)
        this.userService.search(this.searchInput, this.query, this.userService.getCurrentUserToken())
            .subscribe(
                data => {
                    // location.reload();
                    if(this.router.url !== '/dashboard/seller/products' && this.router.url.indexOf('/dashboard/products/search/') === -1) {
                        this.router.navigate(['/dashboard/seller/search', this.searchInput]);
                    }
                    else {
                        this.router.navigate(['/dashboard/products/search', this.searchInput]);
                    }
                    this.userService.setSearchVisitor(data);
                    this.passToParent();
                },
                error => {
                    console.log("Please check for errors")
                });
    }
    logout() {
        if (isPlatformBrowser(this.platformId)) {
            this.authenticationService.logout();
            localStorage.removeItem('makeOrder');
            this.router.navigate(['/login']);
        }
    }

    openModal() {
        this.modalService.open('custom-modal-2');
    }
    closeModal(id: string) {
        this.modalService.close(id);
    }
    onAccountLink(scope, rout?) {
        if (scope === 'buyer') {
            if (rout === 'account') {
                this.router.navigate(['/dashboard/buyer/account']);
            }
            if (rout === 'company') {
                this.router.navigate(['/dashboard/buyer/account/company']);
            }
            if (rout === 'logout') {
                this.logout();
            }

        } else {
            this.openModalRegister.emit();
        }
    }
    register() {
        this.openModalRegister.emit();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
