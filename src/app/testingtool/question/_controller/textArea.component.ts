
import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-textarea',
  templateUrl: '../_views/textarea.compnent.html',
  styleUrls: ['../_views/textarea.compnent.scss', '../../../share/e-home.scss']
})
export class TextAreaComponent extends BaseComponent implements OnInit {
  input: any;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              public dialogRef: MdDialogRef<TextAreaComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
  }

  ngOnInit(): void {
    console.log('init');
  }

  save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }


}
