import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { Photo } from '../_model/photo';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ReportService } from '../_services/report.service';
import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { FilterMedia } from '../_model/filterObj';
import { DatePipe } from '@angular/common';
import { DelReportComponent } from './delReport.component';
import { ElectronService } from 'ngx-electron';
import { IMyDpOptions } from 'ng4-datepicker';
import { Http, Headers, RequestOptions } from '@angular/http';


const restler = require('restler-base');

@Component({
  selector: 'app-media',
  templateUrl: '../_views/report.component.html',
  styleUrls: ['../_views/report.component.scss', '../../../share/e-home.scss']
})
export class ReportComponent extends BaseComponent implements OnInit {
  heightMedia: string;
  picker: any;
  reports: any;
  selectedImage: string;
  tabIndex: number;
  filter: FilterMedia;
  pickerVideo: any;
  dateFormater: DatePipe;
  loading: boolean;
  allReports: any = [];
  filter_name: string;
  fileter_date: any;
  fs: any;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'm/d/yyyy',
  };

  constructor(public dialog: MdDialog,
    private reportService: ReportService,
    public _electronService: ElectronService,
    public ngZone: NgZone,
    protected router: Router,
    public mdSnackBar: MdSnackBar,
    private http: Http) {
      super(router, mdSnackBar, _electronService);
      console.log('start');
      this.reports = [];
      this.loading = false;
      this.loadReports();
      if (!!this._electronService && this._electronService.remote) {
        this.fs = this._electronService.remote.getGlobal('fs');
      }
  }
  ngOnInit() {
  }

  downloadCsv(report) {
    this.loading = true;
    this.reportService.downloadCsv(report.reportId).subscribe(res => {
      this.loading = false;
      console.log(res);
      if (res != undefined && res != null &&
        res.url != undefined && res.url != null) {
        const newWindow = window.open(Baseconst.getPartialBaseUrl() + '/reportcsvpublic/' + res.url);
      }
    });
  }

  loadReports() {
    this.loading = true;
    this.reports = [];
    this.dbReports.find({}, (err, doc) => {
      this.ngZone.run(() => {
        this.reports.push(...doc);
        this.allReports.push(...doc);
        this.loading = false;
        // this.loadCleanReports();
      });
    });

  }

  loadCleanReports() {
    this.dbCleanReports.find({}, (err, doc) => {
      if (doc == undefined || doc == null || doc.length <= 0) {
        this.dbCleanReports.insert(this.allReports, (err, newDoc) => {
          console.log('saved cleanedReport');
        })
      } else {
        console.log('cleand reports already found');
        console.log(JSON.stringify(doc));
      }
    });

  }

  getDate(timestamp) {
    const jsDate = new Date(timestamp);

    return jsDate.toLocaleDateString() + ' ' + jsDate.toLocaleTimeString();
  }

  getFilterDate(timestamp) {
    const jsDate = new Date(timestamp);

    return jsDate.toLocaleDateString();
  }

  restoreCharactersProblems(report) {
    console.log(report);
    let ret = report;
    if (Array.isArray(ret)) {
      if (ret.length > 0) {
        for (let i = 0; i < ret.length; i++) {
          if (typeof(ret[i]) === "object") {
            ret[i] = this.restoreCharactersProblems(ret[i]);
          }
        }
      } else if (Object.keys(ret).length) {
        for (let prop in ret) {
          if (Object.prototype.hasOwnProperty.call(ret, prop)) {
            ret[prop] = this.restoreCharactersProblems(ret[prop]);
          }
        }
      }
    } else {
        for (let prop in ret) {
          if (Object.prototype.hasOwnProperty.call(ret, prop)) {
            console.log(prop);
              let toSubstitute = false;
              let newProp = prop;
              if (prop.indexOf('-_-|-_-') > -1) {
                toSubstitute = true;
                newProp = newProp.replace(/-_-\|-_-/g, '.');
              }
              if (prop.indexOf('-_-!-_-') > -1 ) {
                toSubstitute = true;
                newProp = newProp.replace(/-_-\!-_-/g, '$');
              }
              if (toSubstitute) {
                delete Object.assign(ret, {[newProp]: ret[prop] })[prop];
              }
              if (typeof(ret[newProp]) === "object") {
                ret[newProp] = this.restoreCharactersProblems(ret[newProp]);
              }
          }
      }
    }
  return ret;
  }

  upload(report) {
    report = this.restoreCharactersProblems(report);
    console.log(JSON.stringify(report));
    report.standaloneId = report._id;
    if (report.needUpload == true) {
      this.loading = true;
      console.log('REPORT UPLOAD need upload');
      this.dbReportVideos.find({reportId: report._id}, (err, docs) => {
        let toUpload = docs[0];
        console.log(JSON.stringify(toUpload));
        const files = toUpload.files;
        if (files != undefined && files != null) {
          let promises = new Array();
          console.log('REPORT UPLOAD files');
          /*for(let i = 0; i < files.length; i++) {
            console.log('REPORT UPLOAD file');
            let p = this.uploadFile(files[i], report);
            promises.push(p);
          }*/
          promises.push(this.uploadAllFiles(files, report, files.length));
          console.log('REPORT UPLOAD wait until promises');
          Promise.all(promises).then(p => {
            this.openSnackBar('media upload completed. Uploading report');
            //console.log('REPORT UPLOAD go! ' + JSON.stringify(p));
            /*let go = false;
            for(let i = 0; i < p.length; i++) {
              //console.log(JSON.stringify(p[i]));
              report = this.integrateUploaded(report, p[i]);
              console.log('REPORT integrated! ' + JSON.stringify(report));
              go = true;
            }*/
            this.dbReports.findOne({ _id: report._id }, (err, doc) => {
              if (!!doc) {
                report = doc;
                report.standaloneId = report._id;
                this.reportService.requestCreateReport(report).subscribe(res => {
                  if (res.status == 'OK') {
                    this.openSnackBar('Report uploaded!');
                    this.dbReports.update({ _id: report._id }, { $set: { synced: 1 } }, {}, (err, numReplaced) => {
                      this.loadReports();
                      this.loading = false;
                    });
                  } else {
                    this.loading = false;
                    this.processStatusError(res.errors);
                    console.error('Server error');
                    this.openSnackBar('Server error - It\'s not possible to create the report' );
                  }
                });
              }
            });
            /*if (go) {
              this.loading = false;
              return;
            }*/
            
          }).catch((error) => {
            this.loading = false;
            this.loadReports();
            console.error('Server error');
            this.openSnackBar('Server error - It\'s not possible to create the video response' );
            this.processStatusError(error);
          });
        }
      });
    } else {
      this.loading = true;
      this.reportService.requestCreateReport(report).subscribe(res => {
        if (res.status == 'OK') {
          this.dbReports.update({ _id: report._id }, { $set: { synced: 1 } }, {}, (err, numReplaced) => {
            this.loadReports();
            this.loading = false;
          });
        } else {
          this.loading = false;
          this.processStatusError(res.errors);
          console.error('Server error');
        }
      });
    }
  }

  findAndIntegrateUploaded(reportId, response) {
    return new Promise((resolve, reject) => {
      this.dbReports.findOne({ _id: reportId }, (err, doc) => {
        if (!!doc) {
          let report = this.integrateUploaded(doc, response);
          this.dbReports.update({ _id: report._id }, report, { returnUpdatedDocs : true}, (err, numReplaced, affectedDocuments) => {
            resolve(affectedDocuments);
          });
        }
      });
    });
  }

  integrateUploaded(report, obj) {
    if (report == undefined || report == null) {
      return report;
    }
    if (obj == undefined || obj == null) {
      return report;
    }
    let reportString = JSON.stringify(report);
    reportString = reportString.replace('ID_-_' + obj.name + '_-_', obj.response.response.mediaId);
    return JSON.parse(reportString);
  }

  uploadAllFiles(files, report, totlen) {
    return new Promise((resolve, reject) => {
      if (files == undefined || files == null || files.length <= 0) {
        resolve();
      }
      const currItem = totlen - files.length + 1;
      this.openSnackBar('uploading ' + currItem + ' of ' + totlen);
      this.uploadFile(files[0], report).then((r) => {
        files.shift();
        this.uploadAllFiles(files, report, totlen).then(() => {
          resolve();
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  uploadFile(fileName, report) {
    const testId = report.testId;
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        const token: string = localStorage.getItem('token');
        headers.append('authtoken', token);
        const url = Baseconst.getCompleteBaseUrl() + 'testingtool/media';
        const folderPath = this._electronService.remote.app.getAppPath() + '/temps/' + testId;
        console.log('UPLOADFILE reading ' + folderPath + '/' + fileName);
        this.fs.stat(folderPath + '/' + fileName, (err, stats) => {
            restler.post(url, {
                multipart: true,
                data: {
                    "file": restler.file(folderPath + '/' + fileName, null, stats.size, null, "video/webm", this.fs),
                    "mediaTestId": testId
                },
                headers : {
                  authtoken: token
                }
            }).on("complete", (data) => {
              console.log('UPLOADFILE success');
              console.log(JSON.stringify(data));
              let rr = {
                name: fileName,
                response: data,
            };
            console.log(JSON.stringify(rr));
              if (rr.response.status != 'OK') {
                reject(rr);
              } else {
                //console.log('REMOVING...');
                //this.fs.unlinkSync(folderPath + '/' + fileName);
                //console.log('DELETED!!!');
                this.findAndIntegrateUploaded(report._id, rr).then(() => {
                  resolve(rr);
                });
              }
            });
        });
    });
}

  deleteReport(report) {
    this.loading = true;
    this.dbReports.remove({ _id: report._id }, {}, (err, numRemoved) => {
      this.loadReports();
      this.loading = false;
    });
  }

  doFilter(event?) {
    if (event == undefined) {
      event = null;
    }

    if (this.filter_name == undefined && (event == null || event.formatted == '')) {
      this.reports = this.allReports;
      return;
    }
    this.reports = this.allReports.filter((report) => {

      if (!!this.filter_name && report.reportTestName.toLowerCase().indexOf(this.filter_name.toLowerCase()) != -1) {
        if (!!event && this.getFilterDate(event.epoc) != '' && this.getFilterDate(event.epoc * 1000) != this.getFilterDate(report.testEndTime)) {
          return false;
        }
        return true;
      } else {
        const date = this.getFilterDate(report.testEndTime).split(' ');
        if (!!event && this.getFilterDate(event.epoc) !== '' && this.getFilterDate(event.epoc * 1000) == this.getFilterDate(report.testEndTime)) {
          return true;
        } else {
          return false;
        }
      }
    });
  }

  delReport(p) {
    const dialogRef = this.dialog.open(DelReportComponent);
  }
}
