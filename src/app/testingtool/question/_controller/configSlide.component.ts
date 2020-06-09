import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { QuestionService } from '../_services/question.service';
import { TransitionType } from '../../../models/question';
import { SSlide, SlideType } from '../../../models/component';
import { Transition } from '../../../models/transition';

@Component({
  selector: 'app-config-question-dialog',
  templateUrl: '../_views/configSlide.component.html',
  styleUrls: ['../_views/configSlide.component.scss', '../../../share/base.scss']
})
export class ConfigSlideComponent extends BaseComponent implements OnInit {
  loadingUpdate: boolean;
  slide: SSlide;
  isLoading: boolean;
  transition: Transition;
  types: Array<SlideType>;
  selectElem: any;
  color: any;
  selectedOption = '1';

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    private questionService: QuestionService,
    public dialogRef: MdDialogRef<ConfigSlideComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.slide = data;
    this.types = new Array<SlideType>();
    const tt = Object.getOwnPropertyNames(SlideType);
    for (const key of tt) {
      if (key != undefined && key != null &&
        key != 'length' && key != 'name' && key != 'prototype') {
        this.types.push(key);
      }
    }
  }

  ngOnInit(): void {
    //this.slide = new SSlide();
    this.transition = new Transition();
    this.color = this.slide.options.color;
    this.loadSlideInfo();
  }

  initCheckboxOption() {
    for (let i = 0; i < this.slide.transitionType.length; i++) {
      const t: TransitionType = this.slide.transitionType[i];
      if (t == TransitionType.time) {
        this.transition.time = true;
      }
      if (t == TransitionType.click) {
        this.transition.click = true;
      }
      if (t == TransitionType.enter) {
        this.transition.enter = true;
      }
      if (t == TransitionType.action) {
        this.transition.action = true;
      }
    }
  }

  changeCheckbox(obj, value) {
    if (value == 0) {
      this.transition.time = obj.time ? false : true;
    }
    if (value == 1) {
      this.transition.click = obj.click ? false : true;
    }
    if (value == 2) {
      this.transition.action = obj.action ? false : true;
    }
    if (value == 3) {
      this.transition.enter = obj.enter ? false : true;
    }
    this.addTransition();
  }

  loadSlideInfo() {
    this.isLoading = true;
    if (this.slide.transitionType) {
      this.initCheckboxOption();
    }
    if (this.slide.options.seconds) {
      if (this.slide.options.seconds > 0 && this.slide.options.seconds < 1) {
        this.selectedOption = '0';
        this.transition.second = this.slide.options.seconds * 1000;
      } else {
        this.transition.second = this.slide.options.seconds;
      }
    }
    this.selectElem = { value: this.slide.type };
    this.isLoading = false;
  }

  addTransition() {
    this.slide.transitionType = [];

    for (const key of Object.keys(this.transition)) {
      if (this.transition[key] == false) {
        continue;
      }
      let tt = this.transition.getTransitionType(key);
      if (tt == TransitionType.time && tt) {
        if (this.transition.second == undefined || this.transition.second == null || this.transition.second <= 0) {
          tt = null;
        } else {
          if (this.slide.options == undefined || this.slide.options == null) {
            this.slide.options = new Object();
          }
          this.slide.options.seconds = '' + this.transition.second;
        }
      }
      if (tt != undefined && tt != null && tt) {
        this.slide.transitionType.push(tt);
      }
    }
  }

  updateConfigSlide() {
    this.loadingUpdate = true;
    this.addTransition();
    if (this.slide.options == undefined || this.slide.options == null) {
      this.slide.options = {};
    }
    if (this.transition.time) {

      if (this.selectedOption == '0') {
        this.slide.options.seconds = this.transition.second / 1000;
      } else {
        this.slide.options.seconds = this.transition.second;
      }

    } else {
      this.slide.options.seconds = null;
    }

    this.questionService.requestUpdateSlide(this.slide.slideId, this.slide).subscribe(res => {
      console.log(res);
      if (res.status == 'OK') {
        this.dialogRef.close(res);
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
        this.loadingUpdate = false;
      }
    });
  }

  selectType(selected) {
    this.slide.type = selected;
  }

  selectSeconds(selected) {
    this.selectedOption = selected;
  }

  selectColor(col) {
    console.log(col);
    this.slide.options.color = col;
  }

}
