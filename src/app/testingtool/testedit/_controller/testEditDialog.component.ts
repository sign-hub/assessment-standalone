import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {Router} from '@angular/router';
import {MD_DIALOG_DATA, MdSnackBar, MdDialogRef, MdDialog} from '@angular/material';
import {Test, TestStatus} from '../../../models/test';
import {TestEditService} from '../_services/testEdit.service';
import {TestEventService} from '../../services/testEvent.service';
import {ImportQuestionComponent} from './importQuestion.component';

@Component({
  selector: 'app-test-editor-dialog',
  templateUrl: '../_views/testEditDialog.component.html',
  styleUrls: ['../_views/testEditDialog.component.scss', '../../../share/e-home.scss']
})
export class TestEditDialogComponent extends BaseComponent implements OnInit {
  test: Test;
  loading: boolean;
  options: Array<any>;
  loadingUpdate: boolean;

  constructor(protected router: Router,
              public mdSnackBar: MdSnackBar,
              private testEditService: TestEditService,
              public dialogRef: MdDialogRef<TestEditDialogComponent>,
              public dialog: MdDialog,
              @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.test = this.data;
  }

  ngOnInit(): void {
    this.initOptions();
    this._checkOption();
  }

  initOptions() {
    this.options = [];
    this.options.push({value: false, field: 'suspendable', name: 'Test can be suspended '});
    this.options.push({value: false, field: 'partial', name: 'Test can record partial results '});
    this.options.push({value: false, field: 'randomized', name: 'Test have randomized questions'});
    this.options.push({value: false, field: 'changeable', name: 'User can change already answered questions'});
    this.options.push({value: false, field: 'public', name: 'The test is public'});
  }

  changeOption(o) {
    o.value = !o.value;
  }

  private _checkOption() {
    for (const k in this.test.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].field == k) {
          this.options[i].value = true;
      }
      }
    }
  }

  private _getOptions() {
    const ops = {};
    for (let i = 0; i < this.options.length; i++) {
      const o: any = this.options[i];
      if (this.options[i].value) {
        ops[o.field] = o.value.toString();
      } else {
        ops[o.field] = null;
      }
    }
    return ops;
  }

  publishTest() {
    this.loading = true;
    this.testEditService.requestPublishTest(this.test.TestId).subscribe(res => {
      if (res.status == 'OK') {
        this.test = res.response;
        this.dialogRef.close('OK');
        this.openSnackBar('Publish test successful!');
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });
  }

  updateTest() {
    this.loadingUpdate = true;
    this.test.options = this._getOptions();
    this.test.questions = [];
    if ( this.test.state == TestStatus.NEW) {
      this.test.state = TestStatus.DRAFT;
    }
    this.testEditService.requestUpdateTest(this.test).subscribe(res => {
      if (res.status == 'OK') {
        this.test = res.response;
        this.dialogRef.close('OK');
        this.openSnackBar('Updated test successful!');
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loadingUpdate = false;
    });
  }

  importQuestion() {
    const obj: any = {};
    obj.test = this.test;
    obj.testId = this.test.TestId;
    const dialogRef = this.dialog.open(ImportQuestionComponent, {disableClose: true, data: obj});
    dialogRef.afterClosed().subscribe(res => {
      //this.bindingQuestion(res);
      console.log(res);
    });
  }

}
