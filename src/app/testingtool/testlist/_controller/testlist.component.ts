import {Component, OnInit , NgZone} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {TestListService} from '../_service/testlist.service';
import {NavigationExtras, Router} from '@angular/router';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TestSmall} from '../_model/testSmall';
import {TestEventService} from '../../services/testEvent.service';
import {DeleteTestComponent} from './delTest.component';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-testlist',
  templateUrl: '../_views/testlist.component.html',
  styleUrls: ['../_views/testlist.component.scss', '../../../share/e-home.scss']
})
export class TestListComponent extends BaseComponent implements OnInit {
  data: any = [];
  loading: boolean;
  isEdit: boolean;
  isRemove: boolean;
  test: TestSmall;
  isLoading: boolean;
  filter_name: string;
  allTests: Array<TestSmall>;

  constructor(private testListService: TestListService,
              protected router: Router,
              public mdSnackBar: MdSnackBar,
              public dialog: MdDialog,
              public zone: NgZone,
              public _electronService: ElectronService,
              public testEventService: TestEventService) {
    super(router, mdSnackBar, _electronService);
    this.testEventService.fireEvent.subscribe(res => {
      if (res == 'OK') {
        this.init();
      }
    });

  }

  ngOnInit() {
    this.loading = false;
    this.isEdit = false;
    this.isRemove = false;
    this.init();
  }

  init() {
    this.loading = true;
    this.dbTests.find({}, (err, doc) => {
      this.zone.run(() => {
        this.data.push(...doc);
        this.allTests = this.data;
      });
      if (this.data.length > 0) {
        this.data[0].checked = true;
        this.chooseTest(this.data[0]);
      }
    });
    // this.testListService.getTestList().subscribe(res => {
    //   if (res.status == 'OK') {
    //     this.data = res.response;
    //     this.data = this.data.filter(function (e) {
    //       return !e.deleted;
    //     });
    //     if (this.data.length > 0) {
    //       this.data[0].checked = true;
    //       this.chooseTest(this.data[0]);
    //     }
    //   } else {
    //     console.error('Server error');
    //     this.processStatusError(res.errors);
    //   }
    this.loading = false;
    // });
  }

  editTest() {
    if (this.test) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.test.TestId
        }
      };
      this.router.navigate(['/testedit'], navigationExtras);
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  private unSelectedAll(id) {
    if (this.data && this.data.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].TestId != id) {
          this.data[i].checked = false;
        }
      }
    }
  }

  chooseTest(test) {
    this.unSelectedAll(test.TestId);
    if (test.checked) {
      this.test = test;
      const userId: string = localStorage.getItem('userId');
      this.isRemove = userId == test.authorId ? true : false;
      this.isEdit = test.toEdit;
    } else {
      this.test = null;
    }
  }

  deleteTest() {
    if (this.test) {
      const d = this.dialog.open(DeleteTestComponent, {disableClose: true, data: this.test});
      d.afterClosed().subscribe(res => {
        if (res == 'OK') {
          this.init();
        }
      });
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  cloneTest() {
    if (this.test) {
      this.isLoading = true;
      this.testListService.cloneTest(this.test.TestId).subscribe(res => {
        if (res.status == 'OK') {
          this.openSnackBar('Clone test successful!');
          this.init();
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
        }
        this.isLoading = false;
      });
    } else {
      this.openSnackBar('Please choose a test!');
    }

  }

  viewTest() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.test.TestId,
        preview: false
      }
    };
    this.router.navigate(['/testplayer'], navigationExtras);
  }

  doFilter() {
    if (this.filter_name == undefined) {
      return;
    }
    this. data = this.allTests.filter((test) => {
                    if (test.TestName.toLowerCase().indexOf(this.filter_name.toLowerCase()) != -1) {
                      return true;
                    } else {
                      return false;
                    }
                  });
  }

}
