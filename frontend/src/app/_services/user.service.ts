import { SearchVisitorComponent } from './../dashboard/seller/searchVisitor.component';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthUserInfo, User} from '../_models/index';
import { Company } from '../_models/index';
import {SocketService} from "./socket.service";
import {WebShop} from '../_models/web-shop';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY_AUTH_USER = 'currentUser';

@Injectable()
export class UserService {

    public userType: string;
    public userInfo: string;
    public userPhone: string;
    public searchData: string;
    private _authUserInfo?: AuthUserInfo = null;

    constructor(private http: HttpClient,
                private socketService: SocketService,
                @Inject(PLATFORM_ID) private platformId: any
    ) {}
    
    // todo: move getCurrentUser, isLogged, saveCurrentUser, getCurrentUserToken to AuthenticationService
    getCurrentUser(): AuthUserInfo {
        if (isPlatformBrowser(this.platformId)) {
            if (this._authUserInfo === null || this._authUserInfo === undefined) {
                try {
                    this._authUserInfo = JSON.parse(localStorage.getItem(STORAGE_KEY_AUTH_USER));
                    if (this._authUserInfo !== null && this._authUserInfo !== undefined) {
                        this.socketService.userLogged(this._authUserInfo.token)
                    } else {
                        this.socketService.userUnLogged()
                    }
                } catch (e) {
                    console.log('Could not read user info from local storage')
                    console.error(e)
                    this._authUserInfo = null
                    this.socketService.userUnLogged()
                    localStorage.removeItem(STORAGE_KEY_AUTH_USER)
                }
            }
            return this._authUserInfo
        }
    }
    
    isLogged(): boolean {
        const authUser = this.getCurrentUser()
        return authUser !== null && authUser !== undefined
    }
    
    saveCurrentUser(authUser?: AuthUserInfo) {
        if (isPlatformBrowser(this.platformId)) {
            this._authUserInfo = authUser
            if (authUser === null || authUser === undefined) {
                localStorage.removeItem(STORAGE_KEY_AUTH_USER)
                this.socketService.userUnLogged()
                // todo: logout? navigate to home page? nothing?
            } else {
                localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(authUser))
                this.socketService.userLogged(this._authUserInfo.token)
            }
        }
    }
    
    getCurrentUserToken():string {
        let authUser = this.getCurrentUser()
        if (authUser === null || authUser === undefined) {
            return null
        }
        return authUser.token
    }


    create(user: User) {
        return this.http.post('register/step-one/', user);
    }

    createCompany(company: Company, token) {
        return this.http.post('register/step-two/', company,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    restorePass(user) {
        return this.http.post('password/set-new/', user)
    }

    uploadInvoice(file, token) {
        console.log(token);
        const formData: FormData = new FormData();
        formData.append('invoice', file, file.name);
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'JWT ' + token);
        return this.http.post('register/step-four-upload-invoice/', formData, {headers : headers})
    }

    confirmEmail(token) {
        return this.http.post('register/step-three-confirm-email/', { token: token})
    }

    confirmSubscription(token) {
        return this.http.post('subscription/' + token, { token: token})
    }

    checkToken(token) {
        return this.http.post('token/verify', { token: token})
    }

    getUserType(type) {
        this.userType = type;
    }

    setUserType () {
        return this.userType;
    }

    getUserInfo(info) {
        this.userInfo = info;
    }

    setUserInfo () {
        return this.userInfo;
    } 

    getUserPhone(phone) {
        this.userPhone = phone;
    }

    setUserPhone () {
        return this.userPhone;
    } 

    subscribe(email: string) {
        console.log(email);
        return this.http.post('subscription/', { email: email});
    }

    restore(email: string) {
        return this.http.post('password/request/', { email: email});
    }

    editPersonalInfo(user, token) {
        return this.http.post('profile/', user, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    editCompanyInfo(user, token) {
        return this.http.post('profile/company/', user, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    editPassword(user, token) {
        return this.http.post('profile/change-password/', user, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getMe(token) {
        return this.http.get('me/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    
    getPersonalInfo(token) {
        return this.http.get('profile/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    search(search: string, query: string = '', token: string = '') {
        return this.http.get('products/?search=' + search + query,
        {        
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        });
    }

    searchVisitor(search: string) {
        return this.http.get('products/?search=' + search);
    }

    setSearchVisitor(searchData) {
        this.searchData = searchData;
    }

    getSearchVisitor () {
        return this.searchData;
    }

    resend(token) {
        return this.http.post('register/resend-confirmation/', { token: token}, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    createWebShop(token, model: WebShop) {
        return this.http.post('profile/webshop', model, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })

    }

    getWebShop(token, webshop_url) {
        return this.http.get(`${webshop_url}/`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        });
    }
    getWebShopForVisitor( webshop_url) {
        return this.http.get(`${webshop_url}/`);
    }
    deleteWebShop(token) {
        return this.http.delete(`profile/webshop`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        });
    }

    getNotifications(token) {
        return this.http.get('notifications/?limit=50&offset=0', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    markNotificationsAsRead(token) {
        return this.http.post('notifications/read/', {}, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    checkTokenValidity() {
        const token = this.getCurrentUserToken();
        return this.http.post('token/verify/', {'token': token})
    }
    checkTokenInEmailChanging(token) {
        return this.http.get(`confirm-email-change/${token}`)
    }
}
