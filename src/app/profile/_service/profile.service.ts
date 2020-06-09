
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../share/base.service';

@Injectable()
export class ProfileSerivce extends BaseService {
    constructor(protected http: Http) {
        super(http);
    }

    getUserCurrent() {
        const userId: string = localStorage.getItem('userId');
        return this.requestGet('user/' + userId);
    }

    updateUser(user) {
        const u: any = {};
        u.user = user;
        return this.requestPost('user/' + user.userId, u);
    }
}
