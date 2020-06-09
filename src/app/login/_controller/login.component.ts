import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../_service/authen.service';
import { Login } from '../_model/login';
import { ElectronService } from 'ngx-electron';
import { Baseconst } from '../../share/base.constants';

@Component({
  selector: 'app-login',
  templateUrl: '../_views/login.component.html',
  styleUrls: ['../_views/login.component.scss', '../../share/base.scss']
})
export class LoginComponent implements OnInit {
  buttonLoading: boolean;
  authen: Login;
  isError: boolean;
  dbUsers;
  online: boolean;
  version: string;
  endpoint: string;
  constructor(private router: Router,
    public _electronService: ElectronService,
    public ngZone: NgZone,
    private authenService: AuthenService) {

    if (!!this._electronService && this._electronService.remote) {
      this.dbUsers = this._electronService.remote.getGlobal('dbUsers');
    }


  }

  ngOnInit() {
    this.authen = new Login();
    this.isError = false;
    if (navigator.onLine) {
      this.online = true;
    } else {
      this.online = false;
    }
    this.version = Baseconst.getVersion();
    this.endpoint = Baseconst.getEndpoint();
  }

  doLogin() {
    if (navigator.onLine) {
      this.onlineLogin();
    } else {
      this.offlineLogin();
    }
  }

  onlineLogin() {

    this.buttonLoading = true;
    this.authenService.login(this.authen).subscribe(res => {
      if (res.status == 'OK') {
        this.buttonLoading = false;

        if (!!this.dbUsers) {
          this.dbUsers.remove({}, { multi: true }, (err, numRemoved) => {
            this.dbUsers.insert({ login: this.authen.login, password: btoa(this.authen.password), userId: res.response.userId, token: res.response.token, userProfile: {} }, function (err, doc) { });
          });
        }

        localStorage.setItem('token', res.response.authToken);
        localStorage.setItem('userId', res.response.userId);
        this.router.navigate(['/testdownload']);

      } else {
        this.buttonLoading = false;
        localStorage.clear();
        this.isError = true;
        this.authen.password = null;
        setTimeout(() => {
          this.isError = false;
        }, 3000);
      }
    });
  }

  offlineLogin() {
    if (!!this.dbUsers) {
      // this.ngZone.run(() => {
      this.dbUsers.find({ login: this.authen.login, password: btoa(this.authen.password) }, (err, doc) => {
        this.ngZone.run(() => {
          this.router.navigate(['/testlist']);
        });
      });
      // });

    }
  }

  forgetPassword() {
    this.router.navigate(['/authen/recoverypassword']);
  }

}
