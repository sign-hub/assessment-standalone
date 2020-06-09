import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {BaseService} from '../../share/base.service';
import {TestSmall} from '../testlist/_model/testSmall';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class TestingToolService extends BaseService {

  public fireEvent: Subject<any> = new Subject();
  constructor(protected http: Http) {
    super(http);
  }

  public notify(something: any) {
    this.fireEvent.next(something);
  }

  requestLogout() {
    return this.requestPost('logout', null);
  }

  requestCreateTest(test: TestSmall, type: string) {
    let url = '';
    if (type != undefined && type != null) {
      url += type + '/';
    }
    url += 'test';
    const obj: any = {};
    obj.test = test;
    return this.requestPost(url, obj);
  }
}
