import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-del-media',
  templateUrl: '../_views/delReport.component.html',
  styleUrls: ['../_views/delReport.component.scss']
})
export class DelReportComponent extends BaseComponent implements OnInit {
  uploader: FileUploader;
  buttonSubmitState: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              public dialogRef: MdDialogRef<DelReportComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
  }
}
