import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { Baseconst } from './base.constants';

export abstract class BaseService {
  url: string;
  protected headers: Headers;
  protected options = new RequestOptions({ headers: this.headers });
  constructor(protected http: Http) {
    // this.url = Baseconst.protocol + '://' + Baseconst.url + '/';
    this.url = Baseconst.getPartialBaseUrl() + '/';
  }

  private setToken() {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.headers.append('authtoken', `${localStorage.getItem('token')}`);
    this.options = new RequestOptions({ headers: this.headers });
  }

  requestGet(uri: string) {
    this.setToken();
    return this.http.get(this.url + uri, this.options)
      .map(res => res.json() as Response)
      .catch(this.handleError);
  }
  /*requestRawGet(uri: string) {
    this.setToken();
    return this.http.get(this.url + uri, this.options)
      .catch(this.handleError);
  }*/
  requestRawGet(uri: string) {
    this.setToken();
    console.log(this.url + uri);
    return this.http.get(this.url + uri, this.options)
      .catch(this.handleError);
  }

  requestPost(uri: string, data: any) {
    this.setToken();
    return this.http.post(this.url + uri, data, this.options)
      .map(res => res.json() as Response)
      .catch(this.handleError);
  }
  requestPut(uri: string, data: any) {
    this.setToken();
    return this.http.put(this.url + uri, data, this.options)
      .map(res => res.json() as Response)
      .catch(this.handleError);
  }
  requestDelete(uri: string) {
    this.setToken();
    return this.http.delete(this.url + uri, this.options)
      .map(res => res.json() as Response)
      .catch(this.handleError);
  }
  requestDownloadFile(uri: string) {
    this.setToken();
    return this.http.get(this.url + uri, {
      responseType: ResponseContentType.ArrayBuffer,
      headers: this.headers
    }).map(res => res as Response)
      .catch(this.handleError);
  }



  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
