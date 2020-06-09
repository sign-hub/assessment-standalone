import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {TestEditService} from '../_services/testEdit.service';

@Component({
  selector: 'app-dialog-del-test',
  templateUrl: '../_views/delQuestion.component.html',
  styleUrls: ['../_views/delQuestion.component.scss']
})
export class DeleteQuestionComponent extends BaseComponent implements OnInit {
  isLoading: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              private testListService: TestEditService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DeleteQuestionComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
  }

  deleteQuestion() {
    this.isLoading = true;
    this.testListService.deleteQuestion(this.data.questionId).subscribe(res => {
      if (res.status == 'OK') {
        this.dialogRef.close('OK');
        this.openSnackBar('Deleted question successful!');
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.isLoading = false;
    });
  }
}
