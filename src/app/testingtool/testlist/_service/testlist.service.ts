import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BaseService} from '../../../share/base.service';

@Injectable()
export class TestListService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  getTestList() {
    return this.requestGet('testingtool/test');
  }

  deleteTest(id) {
    return this.requestDelete('test/' + id);
  }

  cloneTest(id) {
    const obj: any = {};
    obj.testId = id;
    return this.requestPost('cloneTest', obj);
  }
}
