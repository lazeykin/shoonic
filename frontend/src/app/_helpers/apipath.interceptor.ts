import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiPathInterceptor implements HttpInterceptor {
    url_prefix = '/api/v1/';
    // url_prefix = 'https://shonic.dev.tseh20.com/api/v1/'; never uncomment this, check readme and use ng serve --proxy-config

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        if ((request.url.indexOf('http:') < 0) && (request.url.indexOf('https:') < 0)) {
            request = request.clone({
                url: this.url_prefix + request.url
            });
        }
        return next.handle(request);
    }
}