import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../share/base.service';

@Injectable()
export class ForgetService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }
  requestForget(params: any) {
    return this.requestPost('passwordReset', params);
  }
}
