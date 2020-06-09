import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {TestListService} from '../_service/testlist.service';

@Component({
  selector: 'app-dialog-del-test',
  templateUrl: '../_views/delTest.component.html',
  styleUrls: ['../_views/delTest.component.scss']
})
export class DeleteTestComponent extends BaseComponent implements OnInit {
  isLoading: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              private testListService: TestListService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DeleteTestComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
  }

  deleteTest() {
    this.isLoading = true;
    this.testListService.deleteTest(this.data.TestId).subscribe(res => {
      if (res.status == 'OK') {
        this.dialogRef.close('OK');
        this.openSnackBar('Deleted test successful!');
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.isLoading = false;
    });
  }
}
