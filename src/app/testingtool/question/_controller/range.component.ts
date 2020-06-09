import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/range.component.html',
  styleUrls: ['../_views/range.component.scss', '../../../share/base.scss']
})
export class RangeComponent extends BaseComponent implements OnInit {
  input: any;
  new: any;
  labels: Array<any>;
  addLabel: boolean;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<RangeComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.new = {};
    console.log('c');
    this.labels = new Array();
    this.input = this.data;
    if (this.input.options == undefined || this.input.options == null) {
      this.input.options = {};
      this.input.options.showticks = false;
      this.input.options.showlabels = false;
    }
    this.fromOptions();
    this.addLabel = false;
  }

  ngOnInit(): void {
  }

  save() {
    this.toOptions();
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeShowTicks() {
    this.input.options.showticks = !this.input.options.showticks;
  }

  changeShowLabels() {
    this.input.options.showlabels = !this.input.options.showlabels;
  }

  addNewLabel() {
    const n = {};
    n['label'] = this.new['label'];
    this.new = {};
    this.addLabel = false;
    this.labels.push(n);
  }

  deleteLabel(i) {
    this.labels.splice(i, 1);
  }

  fromOptions() {
    if (this.input.options['labelNum'] == undefined || this.input.options['labelNum'] == null) {
      this.input.options['labelNum'] = 0;
    }
    this.labels = new Array<any>();
    for (let i = 0; i < this.input.options['labelNum']; i++) {
      this.labels[i] = {};
      this.labels[i]['label'] = this.input.options['label_' + i];
    }

    if (this.input.options.showticks == 'false')
      this.input.options.showticks = false;

    if (this.input.options.showticks == 'true')
      this.input.options.showticks = true;

    if (this.input.options.showlabels == 'false')
      this.input.options.showlabels = false;

    if (this.input.options.showlabels == 'true')
      this.input.options.showlabels = true;

  }

  toOptions() {
    for (const property in this.input.options) {
      if (this.input.options.hasOwnProperty(property)) {
        if (property.startsWith('label')) {
          delete this.input.options[property];
        }
      }
    }

    delete this.input.labels;

    this.input.options['labelNum'] = this.labels.length;

    for (let i = 0; i < this.labels.length; i++) {
      this.input.options['label_' + i] = this.labels[i]['label'];
    }

  }

}
