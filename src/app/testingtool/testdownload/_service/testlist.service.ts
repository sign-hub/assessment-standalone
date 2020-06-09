import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, ResponseContentType} from '@angular/http';
import {BaseService} from '../../../share/base.service';

@Injectable()
export class TestListService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  getTestList() {
    return this.requestGet('testingtool/test');
  }

  getMedias () {
    return this.requestGet('media');
  }

  getMedia(mediaId) {
    console.log('testingtool/media/' + mediaId);
    return this.requestGet('testingtool/media/' + mediaId);
  }


  requestGetQuestionInfo(id) {
    return this.requestGet('question/' + id + '?complete=true');
  }

  requetGetTest(id) {
    return this.requestGet('test/' + id + '?complete=true');
  }

  requetGetImage(url) {
    return this.requestRawGet(url);
  }

  getReportList() {
    return this.requestGet('report');
  }

  deleteTest(id) {
    return this.requestDelete('test/' + id);
  }

  cloneTest(id) {
    const obj: any = {};
    obj.testId = id;
    return this.requestPost('cloneTest', obj);
  }

   getImage(imageUrl: string) {
    return this.http.get(imageUrl, {responseType: ResponseContentType.ArrayBuffer}).map(res => res as Response);
  }
}
