import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class MediaService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  getMedia(type: string) {
    return this.requestGet('testingtool/media?mediaType=' + type);
  }

  getMediaById(id: string) {
    return this.requestGet('media/id');
  }

  getMediaByTestId(id: string) {
    return this.requestGet('testingtool/media?testId=' + id);
  }

  deleteMedia(id: string){
    return this.requestDelete('testingtool/media/' + id);
  }

  filterMedia(type: string, mediaName: string, mediaAuthor: string, mediaDate: string) {
    let uri: string = 'testingtool/media?mediaType=' + type;
    if (mediaName && mediaName.length > 0) {
      uri += '&mediaName=' + mediaName;
    }
    if (mediaAuthor && mediaAuthor.length > 0) {
      uri += '&mediaAuthor=' + mediaAuthor;
    }
    if (mediaDate && mediaDate.length > 0) {
      uri += '&mediaDate=' + mediaDate;
    }
    return this.requestGet(uri);
  }
}