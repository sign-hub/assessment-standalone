import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/button.component.html',
  styleUrls: ['../_views/button.component.scss', '../../../share/base.scss']
})
export class ButtonComponent extends BaseComponent implements OnInit {
  input: any;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ButtonComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
    if (this.input.options != undefined && this.input.options != null) {
      this.input.name = this.input.options.name;
    }
  }

  ngOnInit(): void {
  }

  save() {
    this.input.options.name = this.input.name;
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

  selectStyle(val) {
    this.input.options.bstyle = val;
  }

}
