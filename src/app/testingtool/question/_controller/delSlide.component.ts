import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {QuestionService} from '../_services/question.service';

@Component({
  selector: 'app-dialog-del-test',
  templateUrl: '../_views/delSlide.component.html',
  styleUrls: ['../_views/delSlide.component.scss']
})
export class DeleteSlideComponent extends BaseComponent implements OnInit {
  isLoading: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              private questionService: QuestionService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DeleteSlideComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
  }

  deleteTest() {
    this.isLoading = true;
    this.questionService.deleteSlide(this.data.slideId).subscribe(res => {
      if (res.status == 'OK') {
        this.dialogRef.close('OK');
        this.openSnackBar('Deleted slide successful!');
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.isLoading = false;
    });
  }
}
