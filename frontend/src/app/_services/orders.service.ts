import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrdersService {
    
    constructor(private http: HttpClient) { 
        
    }

    pendingOrders(token) {
        return this.http.get('accounts/order/?status=pending', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    approvedOrders(token) {
        return this.http.get('accounts/order/?status=approved', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    rejectedOrders(token) {
        return this.http.get('accounts/order/?status=rejected', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allOrders(token) {
        return this.http.get('accounts/order/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    reOrder(token, id) {
        return this.http.get('accounts/order/'+ id +'/approve/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    rejectOrder(token, id) {
        return this.http.get('accounts/order/'+ id +'/reject/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    uploadDocument(token, user_id, file) {
        const formData = new FormData();
        console.log(file)
        formData.append('file', file);
        formData.append('user_id', user_id)
        return this.http.post('profile/files/', formData, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token) 
        })
    }

    batch(token, operations) {
        return this.http.post('batch/', operations,  {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getAllDocuments(token) {
        return this.http.get('profile/files/?limit=100&offset=0', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    deleteDocumentById(token, id) {
        return this.http.delete(`profile/files/delete/${id}/`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    rateOrder(token, order_id, rating) {
        return this.http.post(`rating/${order_id}`, { score: rating }, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

}