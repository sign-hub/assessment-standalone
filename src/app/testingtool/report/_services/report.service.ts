import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class ReportService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  getReport() {
    return this.requestGet('testingtool/report');
  }

  getReportById(id: string) {
    return this.requestGet('report/id=' + id);
  }

  downloadCsv(id) {
    return this.requestGet('reportcsv/' + id);
  }

  requestCreateReport(data) {
    return this.requestPost('report', data);
  }

}