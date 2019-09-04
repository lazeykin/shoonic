import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Contact, Dialog, Message, Paginated} from '../_models';
import {Observable} from "rxjs";

@Injectable()
export class MessengerService {
    public products: any = [];
    public productImage: File;
    public product: string;
    public cartItemsQuantity: number;

    constructor(private http: HttpClient) {
    }
    
    static paramsObjToHttpParams<T>(paramsObj?:object): HttpParams {
        let params = new HttpParams();
        if (paramsObj !== null && paramsObj !== undefined) {
            // we were given filtering criteria, build the query string
            Object.keys(paramsObj).sort().forEach(key => {
                const value = paramsObj[key];
                if (value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }
        
        return params
    }

    getContacts(token, paramsObj?:object):Observable<Paginated<Contact>> {
        console.log(`getContacts params=${JSON.stringify(paramsObj)}`)
        const url = 'contacts/'
        const params = MessengerService.paramsObjToHttpParams(paramsObj)
        
        return this.http.get<Paginated<Contact>>(url, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
            params: params
        })
    }
    getContactGroupMembers(token, id, paramsObj?:object):Observable<Paginated<Contact>> {
        console.log(`getContacts params=${JSON.stringify(paramsObj)}`)
        const url = `contact-groups/${id}/members/`
        const params = MessengerService.paramsObjToHttpParams(paramsObj)

        return this.http.get<Paginated<Contact>>(url, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
            params: params
        })
    }
    
    getDialogs(token, paramsObj?:object):Observable<Paginated<Dialog>> {
        const url = 'dialogs/'
        if (paramsObj && paramsObj['search']) {
            let search = paramsObj['search']
            let regex = /(user:\d+)/g
            let cleaned = search.replace(regex, '')
            let user_id = search.match(regex)
            if (user_id && user_id.length > 0) {
                user_id = parseInt(user_id[0].split(':')[1])
                paramsObj['user_id'] = user_id
            }
            paramsObj['search'] = cleaned
        }
        const params = MessengerService.paramsObjToHttpParams(paramsObj)
        
        return this.http.get<Paginated<Dialog>>(url, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
            params: params
        })
    }
    
    getDialogById(token, dialog_id):Observable<Dialog> {
        const url = 'dialogs/' + dialog_id
        return this.http.get<Dialog>(url, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    
    getDialogMessages(token, dialog_id, last_message_id):Observable<Paginated<Message>> {
        const url = 'dialogs/' + dialog_id + '/messages'
        let params = {
            'fetch': 10,
            'offset': 0,
        };
        if (last_message_id) {
            params['last_message_id'] = last_message_id
        }
        console.log('getDialogMessages params')
        console.log(params)
        return this.http.get<Paginated<Message>>(url, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
            params: MessengerService.paramsObjToHttpParams(params)
        })
    }
    
    markDialogAsRead(token, dialog_id):Observable<any> {
        return this.http.post<Message>(`dialogs/${dialog_id}/mark-read`, {},{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
        })
    }
    
    sendFileMessage(token, dialog_id, file):Observable<Message> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        
        return this.http.post<Message>(`dialogs/${dialog_id}/messages`, formData,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
        })
    }
    
     sendTextMessage(token, dialog_id, text):Observable<Message> {
        return this.http.post<Message>(`dialogs/${dialog_id}/messages`, {
            'text': text,
        },{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
        })
    }

    createContactGroup(token, contact_goup) {
    return this.http.post('contact-groups/', contact_goup,
        {
    headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
    })
    }

    getContactGroup(token, params:object=null) {
        const url = 'contact-groups/'
        return this.http.get(url, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
            params: MessengerService.paramsObjToHttpParams(params)
        })
    }

    deleteContactGroup(token, id) {
        return this.http.delete(`contact-groups/${id}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    deleteMultipleContactGroups(token, idArray) {
        const request = {
            operations: []
        };
        for (let id of idArray) {
            request.operations.push({
                method: 'DELETE',
                path: `/api/v1/contact-groups/${id}`
            })
        }

        return this.http.post('batch', request, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    
    removeMultipleContacts(token, cgId, idArray) {
        const request = {
            operations: []
        };
        for (let id of idArray) {
            request.operations.push({
                method: 'DELETE',
                path: `/api/v1/contact-groups/${cgId}/members/${id}`
            })
        }

        return this.http.post('batch', request, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    addMultipleContacts(token, cgId, idArray) {
        const request = {
            operations: []
        };
        for (let id of idArray) {
            request.operations.push({
                method: 'POST',
                path: `/api/v1/contact-groups/${cgId}/members/${id}`
            })
        }

        return this.http.post('batch', request, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getSpecificGroup(token, id) {
        return this.http.get(`contact-groups/${id}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    removeGroupMember(token, cg_id, cg_member_id) {
        return this.http.delete(`contact-groups/${cg_id}/members/${cg_member_id}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    editContactGroup(token, id, model) {
        return this.http.put(`contact-groups/${id}/`, model,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    addContactToGroup(token, id, model) {
        return this.http.post(`contact-groups/${id}/members/`, model,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getFullContactInfo(token, cg_id, cg_member_id) {
        return this.http.get(`contact-groups/${cg_id}/members/${cg_member_id}/`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
}
