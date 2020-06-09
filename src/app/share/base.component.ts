import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Error } from './_model/error';
import { Baseconst } from './base.constants';
import { ElectronService } from 'ngx-electron';

declare var require: any;
const Datastore = require('nedb');


export abstract class BaseComponent {
  wHeight: string;
  height: number;
  width: number;
  url: string;
  public isOnline = false;

  dbTests;
  dbMedias;
  dbReports;
  dbCleanReports;
  dbReportVideos;
  dbUsers;
  base_path;
  constructor(protected router: Router,
    protected snackBar: MdSnackBar,
    public _electronService: ElectronService = null) {


    if (!!this._electronService && this._electronService.remote) {
      this.dbTests = this._electronService.remote.getGlobal('dbTests');
      this.dbMedias = this._electronService.remote.getGlobal('dbMedias');
      this.dbReports = this._electronService.remote.getGlobal('dbReports');
      this.dbCleanReports = this._electronService.remote.getGlobal('dbCleanReports');
      this.dbReportVideos = this._electronService.remote.getGlobal('dbReportVideos');
      this.dbUsers = this._electronService.remote.getGlobal('dbUsers');
      this.base_path = this._electronService.remote.app.getAppPath();
    } else {
      this.dbTests = new Datastore({ filename: 'tests.db', autoload: true });
      this.dbMedias = new Datastore({ filename: 'medias.db', autoload: true });
      this.dbReports = new Datastore({ filename: 'reports.db', autoload: true });
      this.dbReportVideos = new Datastore({ filename: 'reportVideos.db', autoload: true });
      this.dbCleanReports = new Datastore({ filename: 'database/cleanReports.db', autoload: true });

    }


    this.height = (window.screen.height - 200);
    // this.height = (window.innerHeight);
    this.width = (window.screen.width);
    // this.width = (window.innerWidth);
    this.wHeight = this.height + 'px';
    this.url = Baseconst.getPartialBaseUrl();

    if (navigator.onLine) {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }

    window.addEventListener('offline', () => {
      this.isOnline = navigator.onLine;
    });

    window.addEventListener('online', (e) => {
      this.isOnline = navigator.onLine;
    });

  }

  processStatusError(errors: Error[]) {
    if (errors && errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        switch (error.errorCode) {
          case 3:
            localStorage.clear();
            this.openSnackBar('Token expired, please login again');
            this.router.navigate(['/authen/login']);
            break;
          default:
            this.openSnackBar(error.errorMessage);
            console.error(error.errorCode);
            break;
        }
      }
    }
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }
}
