import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { TestEditService } from '../_services/testEdit.service';
import { Question, TransitionType } from '../../../models/question';
import { Transition } from '../../../models/transition';

@Component({
  selector: 'app-config-question-dialog',
  templateUrl: '../_views/configQuestion.component.html',
  styleUrls: ['../_views/configQuestion.component.scss', '../../../share/base.scss']
})
export class ConfigQuestionComponent extends BaseComponent implements OnInit {
  loadingUpdate: boolean;
  question: Question;
  isLoading: boolean;
  transition: Transition;
  questions: Array<Question>;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ConfigQuestionComponent>,
    private testEditService: TestEditService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
  }

  ngOnInit(): void {
    this.question = new Question();
    this.question.options = {};
    this.transition = new Transition();
    this.loadQuestionInfo();
  }

  initCheckboxOption() {
    for (let i = 0; i < this.question.transitionType.length; i++) {
      const t: TransitionType = this.question.transitionType[i];
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
  }

  loadQuestionInfo() {
    this.isLoading = true;
    this.testEditService.requestGetQuestion(this.data.question.questionId).subscribe(res => {
      if (res.status == 'OK') {
        this.question = res.response;
        if (this.question.transitionType) {
          this.initCheckboxOption();
        }
        if (this.question.options.seconds) {
          this.transition.second = this.question.options.seconds;
        }
        if (this.question.options == undefined || this.question.options == null) {
          this.question.options = {};
        }
        if (this.question.options.notRandomizeQuestion == undefined || this.question.options.notRandomizeQuestion == null || this.question.options.notRandomizeQuestion == '') {
          this.question.options.notRandomizeQuestion = false;
        }
        /*this.testEditService.requestQuestionList(this.data.testId).subscribe(res => {
          if (res.status == 'OK') {
            this.questions = res.response;
          } else {
            console.error('Server error');
            this.processStatusError(res.errors);
          }
        });*/
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  addTransition() {
    this.question.transitionType = [];
    /*for (const t in this.transition) {
      if (this.transition[t] == true) {
        this.question.transitionType.push(t.getTransitionType());
      }
    }*/
    for (const key of Object.keys(this.transition)) {
      let tt = this.transition.getTransitionType(key);
      if (tt == TransitionType.time) {
        if (this.transition.second == undefined || this.transition.second == null || this.transition.second <= 0) {
          tt = null;
        } else {
          if (this.question.options == undefined || this.question.options == null) {
            this.question.options = new Object();
          }
          this.question.options.seconds = '' + this.transition.second;
        }
      }
      if (tt != undefined && tt != null) {
        this.question.transitionType.push(tt);
      }
    }
  }

  updateConfigQuestion() {
    this.loadingUpdate = true;
    this.addTransition();
    if (this.question.options == undefined || this.question.options == null) {
      this.question.options = new Object();
    }
    if (this.transition.time) {
      this.question.options.seconds = this.transition.second;
    }
    this.question.slides = [];
    this.testEditService.requestUpdateConfigQuestion(this.question).subscribe(res => {
      if (res.status == 'OK') {
        this.dialogRef.close(res.response);
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loadingUpdate = false;
    });
  }

  changeRandomizeFlag(event) {
    this.question.options.notRandomizeQuestion = event.checked;
  }
}
