import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, BaseRequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

export class CustomRequestOptions extends BaseRequestOptions {
    constructor() {
        super();
        const token: string = localStorage.getItem('token');
        if (token) {
            this.headers.append('authtoken', token);
        }
    }
}
