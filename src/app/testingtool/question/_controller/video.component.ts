import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/video.component.html',
  styleUrls: ['../_views/video.component.scss', '../../../share/base.scss']
})
export class VideoComponent extends BaseComponent {
  input: any;
  autoplay: boolean;
  commands: boolean;
  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<VideoComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);

    this.input = this.data;

    if (this.input.options == undefined || this.input.options == null)
      this.input.options = {};

    if (this.input.options.autoplay != undefined && this.input.options.autoplay != null && this.input.options.autoplay == 'true') {
      this.autoplay = true;
    } else {
      this.autoplay = false;
    }
    if (this.input.options.commands != undefined && this.input.options.commands != null && this.input.options.commands == 'true') {
      this.commands = true;
    } else {
      this.commands = false;
    }

    if (this.input.options.name != undefined && this.input.options.name != null && this.input.options.name != '') {
      this.input.options.name = this.input.options.name;
    }

  }

  save() {
    if (this.input == undefined || this.input == null) {
      this.input = {};
    }
    if (this.autoplay == true) {
      this.input.options.autoplay = 'true';
    } else {
      this.input.options.autoplay = 'false';
    }

    if (this.commands == true) {
      this.input.options.commands = 'true';
    } else {
      this.input.options.commands = 'false';
    }

    if (this.input.options.name != undefined && this.input.options.name != null) {
      this.input.options.name = this.input.options.name;
    }
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.options.transition = !this.input.options.transition;
  }

  changeCheckable() {
    this.autoplay = !this.autoplay;
  }
  changeCommands() {
    this.commands = !this.commands;
  }

}
