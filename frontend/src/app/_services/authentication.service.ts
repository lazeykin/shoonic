import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {UserService} from "./user.service";
import {Login} from '../_models/login';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient, private userService: UserService,
                @Inject(PLATFORM_ID) private platformId: any
    ) { }
    

    login(email: string, password: string) {
        return this.http.post<any>('login/', { email: email, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // wtf? why there is nothing?
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        this.userService.saveCurrentUser(null)
        this.setRememberStatus(false);
    }
    setRememberStatus(value) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('rememberMe', value.toString());
        }
    }
    getRememberStatus() {
        if (isPlatformBrowser(this.platformId)) {
            let rememberStatus;
            try {
                rememberStatus = JSON.parse(localStorage.getItem('rememberMe'));

            } catch (e) {
                console.log('Could not read user info from local storage');
                console.error(e);
                localStorage.removeItem('rememberMe');
                rememberStatus = null;
            }
            return rememberStatus
        }
    }
    generateNewToken(token, model: Login) {
        return this.http.post('external/token/generate/', model,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
}
