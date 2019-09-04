import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Company} from '../_models';

@Injectable()
export class ShowroomsService {
    public showroomImage: File;
    public showroomName: string;
    public showroomDesc: string;
    public products: any = [];

    constructor(private http: HttpClient) {
    }

    getShowroomImage(image: File) {
        this.showroomImage = image;

    }

    setShowroomImage() {
        return this.showroomImage;
    }

    setShowroomName(name) {
        this.showroomName = name;
    }

    getShowroomName() {
        return this.showroomName;
    }

    setShowroomDesc(desc) {
        this.showroomDesc = desc;
    }

    allShowrooms(token) {
        return this.http.get('showrooms/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allShowroomsPageBuyer(token, query) {
        return this.http.get(`showrooms/${query}&is_private=true`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allShowroomsFilter(token, filter) {
        return this.http.get('showrooms/' + filter, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allShowroomsPage(token, query) {
        return this.http.get(`showrooms/${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    specificSellerShowrooms(token, webshop_url, query) {
        return this.http.get(`${webshop_url}/showrooms/?archived=false&is_private=false&${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    specificSellerShowroomsForVisitor(webshop_url, query) {
        return this.http.get(`${webshop_url}/showrooms/?archived=false&is_private=false&${query}`
        )
    }
    specificSellerPrivateShowrooms(token, webshop_url, query) {
        return this.http.get(`${webshop_url}/showrooms/?archived=false&is_private=true&${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    activeShowrooms(token) {
        return this.http.get('showrooms/?archived=false', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    activeShowroomsPage(token, query) {
        return this.http.get(`showrooms/?archived=false${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    publicShowroomsPage(token, query) {
        return this.http.get(`showrooms/?archived=false&is_private=false${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    privateShowroomsPage(token, query) {
        return this.http.get(`showrooms/?archived=false&is_private=true${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    archivedShowroomsPage(token, query) {
        return this.http.get(`showrooms/?archived=true${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    archivedShowrooms(token) {
        return this.http.get('showrooms/?archived=true', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    archiveShowroom(token, sr, sr_id) {
        console.log(token);
        return this.http.post('showrooms/'+sr_id+'/archive', sr, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    unarchiveShowroom(token, sr_id) {
        return this.http.delete('showrooms/' + sr_id + '/archive/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    updateShowroom(token, sr_id, sr) {
        return this.http.put('showrooms/' + sr_id + '/', sr, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    createShowroom(token, sr) {
        return this.http.post('showrooms/', sr, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    singleShowroomNotRegistered(sr_id) {
        return this.http.get('showrooms/' + sr_id);
    }
    singleShowroom(token, sr_id) {
        return this.http.get('showrooms/' + sr_id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    singleShowroomForVisitor(sr_id) {
        return this.http.get('showrooms/' + sr_id
        )
    }
    getContactGroups(token) {
        return this.http.get('contact-groups/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getContactGroupsPage(token, query) {
        return this.http.get('contact-groups/' + query, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    

}
