import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SRadioComponent } from '../../../models/component';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/radio.component.html',
  styleUrls: ['../_views/radio.component.scss', '../../../share/base.scss']
})
export class RadioComponent extends BaseComponent implements OnInit {
  input: any;
  new: SRadioComponent;
  addRadio: boolean;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<RadioComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
    this.addRadio = false;
    this.initNew();
  }

  initNew() {
    this.new = new SRadioComponent();
    this.new.label = null;
    this.new.value = null;
    this.new.isCorrect = false;
  }

  ngOnInit(): void {
  }

  save() {
    if (this.input.groupName == undefined || this.input.groupName == null || this.input.groupName == '') {
      return;
    }
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  addNewRadio() {
    if (this.new != undefined && this.new != null) {
      if (this.input.radioComponent == undefined || this.input.radioComponent == null) {
        this.input.radioComponent = new Array<SRadioComponent>();
      }
      const newComp = new SRadioComponent();
      newComp.label = this.new.label;
      newComp.value = this.new.value;
      newComp.isCorrect = this.new.isCorrect;
      this.input.radioComponent.push(newComp);
      this.initNew();
      this.addRadio = false;
    }
  }

  deleteRadio(r) {
    if (r == undefined || r == null) {
      return;
    }
    this.input.radioComponent.splice(r);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

  changeIsCorrect() {
    this.new.isCorrect = !this.new.isCorrect;
  }

}
