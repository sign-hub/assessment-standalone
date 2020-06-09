import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/image.component.html',
  styleUrls: ['../_views/image.component.scss', '../../../share/base.scss']
})
export class ImageComponent extends BaseComponent implements OnInit {
  input: any;
  checkable: boolean;
  shadow: boolean;
  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ImageComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);

    this.input = this.data;

    if (this.input.options == undefined || this.input.options == null) {
      this.input.options = {};
    }

    if (this.input.options.checkable != undefined && this.input.options.checkable != null && this.input.options.checkable == 'true') {
      this.checkable = true;
    } else {
      this.checkable = false;
    }

    if (this.input.options.shadow != undefined && this.input.options.shadow != null && this.input.options.shadow == 'true') {
      this.shadow = true;
    } else {
      this.shadow = false;
    }

    if (this.input.options.name != undefined && this.input.options.name != null && this.input.options.name != '') {
      this.input.name = this.input.options.name;
    }

  }

  ngOnInit(): void {
  }

  save() {
    if (this.input.options == undefined || this.input.options == null) {
      this.input.options = {};
    }
    if (this.checkable == true) {
      this.input.options.checkable = 'true';
    } else {
      this.input.options.checkable = 'false';
    }
    if (this.shadow == true) {
      this.input.options.shadow = 'true';
    } else {
      this.input.options.shadow = 'false';
    }
    if (this.input.name != undefined && this.input.name != null) {
      this.input.options.name = this.input.name;
    }
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

  changeCheckable() {
    this.checkable = !this.checkable;
  }

  changeShadow() {
    this.shadow = !this.shadow;
  }

}
