import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/inputField.component.html',
  styleUrls: ['../_views/inputField.component.scss', '../../../share/base.scss']
})
export class InputFieldComponent extends BaseComponent implements OnInit {
  input: any;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<InputFieldComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
  }

  ngOnInit(): void {
  }

  save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

}
