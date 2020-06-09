import {Component, OnInit, NgZone} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {TestingToolService} from '../services/testingTool.service';
import {ProfileSerivce} from '../../profile/_service/profile.service';
import {BaseComponent} from '../../share/base.component';
import {MdSnackBar} from '@angular/material';
import {MdDialog} from '@angular/material';
import {ElectronService} from 'ngx-electron';
import { ProfileInfo } from '../../profile/_model/pofileInfo';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: '../_views/testingtool.component.html',
  styleUrls: ['../_views/testingtool.component.scss']
})
export class TestingToolComponent extends BaseComponent implements OnInit {
  menus: any;
  user: any;
  // public isOnline = false;
  profileInfo: ProfileInfo;
  profileInfoClone: ProfileInfo;

  constructor(public router: Router,
              private translate: TranslateService,
              private testingToolService: TestingToolService,
              private profileSerivce: ProfileSerivce,
              public _electronService: ElectronService,
              public ngZone: NgZone,
              public dialog: MdDialog,
              public mdSnackBar: MdSnackBar,
              public sanitizer: DomSanitizer) {
    super(router, mdSnackBar, _electronService);
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.user = {};
      if (navigator.onLine) {
        this.loadUserInfo();
      } else {
        this.getUserInfo();
      }
    });
  }

  logout() {
    console.log(navigator.onLine);
    if (!navigator.onLine) {
      localStorage.clear();
      this.router.navigate(['/authen/login']);
      return;
    } else {

      this.testingToolService.requestLogout().subscribe(res => {
        localStorage.clear();
        if (res.status == 'OK') {
          this.router.navigate(['/authen/login']);
        } else {
          console.error('Server error');
        }
      });

    }
  }

  getUserInfo() {
    if (!!this.dbUsers) {
      this.ngZone.run(() => {
        this.dbUsers.find({}, (err, docs) => {
          this.profileInfo = docs[0].userProfile;
          this.profileInfoClone = Object.assign({}, this.profileInfo);
          console.log(docs);
        });
      });
    }
  }

  loadUserInfo() {
    const userStr: string = localStorage.getItem('userInfo');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.profileSerivce.getUserCurrent().subscribe(res => {
        if (res.status == 'OK') {
          this.user = res.response;
          localStorage.setItem('userInfo', JSON.stringify(this.user));
        } else {
          console.log(res.errors);
          this.processStatusError(res.errors);
          console.error('Server error');
        }
      },
      err => {
        console.log(err);
      });
    }
  }

  createTest() {
    this.testingToolService.requestCreateTest(null, 'testingtool').subscribe(res => {
      if (res.status == 'OK') {
        this.testingToolService.notify('OK');
        this.openSnackBar('Created test successful!');
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: res.response.TestId
          }
        };
        this.router.navigate(['/testedit'], navigationExtras);
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
    });
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  sanitaze(path: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
}
