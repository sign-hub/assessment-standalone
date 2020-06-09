import {
  AfterViewInit, Component, OnInit, ComponentFactoryResolver, NgZone
} from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { MediaService } from '../../media/_services/media.service';
import { Photo } from '../../media/_model/photo';
import { TestPlayerService } from '../_services/testPlayer.service';
import { Question, TransitionType } from '../../../models/question';
import { Test } from '../../../models/test';
import { SComponent, SSlide, SComp, SlideComponent, SlideType, SCompType, TestResult, QuestionResult } from '../../../models/component';
import { ResizeEvent } from 'angular-resizable-element';
import { UserInfoComponent } from '../_controller/userInfo.component';
import { ElectronService } from 'ngx-electron';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamDialogComponent } from './webcamDialog.component';


declare var jQuery: any;

@Component({
  selector: 'app-question',
  templateUrl: '../_views/testPlayer.component.html',
  styleUrls: ['../_views/testPlayer.component.scss', '../../../share/e-home.scss']
})
export class TestPlayerComponent extends BaseComponent implements OnInit, AfterViewInit {
  //hieghtQuestion: string;
  heightQuestionCenter: string;
  heightQuestionCenterContent: string;
  //heightContentTab: string;
  widthQuestionCenter: string;
  medias: Array<Photo>;
  selectedTab: string;
  allMedias: Array<Photo>;
  allMedias1: Array<Photo>;
  mediaLoading: boolean;
  testId: string;
  test: Test;
  questions: Array<Question>;
  questionLoading: boolean;
  components: Array<Array<SComponent>> = [[]];
  currentComponents: Array<SComponent> = [];
  currentSlideId: string;
  currentSlideIndex: number;
  currentSlide: SSlide;
  currentQuestionId: string;
  currentQuestion: Question;
  currentQuestionIndex: number;
  timer: any;
  result: TestResult;
  resultQuestion: QuestionResult;
  canChange: boolean;
  backgroundColor: string;
  currentSlideName: string;
  preview: boolean;
  stimulusOrderInTest: number;
  stimulusOrderInBlock: number;
  currentBlock: string;
  metiaTypes = ['VIDEO', 'IMAGE', 'EAN', 'TEXT'];
  selectHighlight: string;
  fs: any;
  questionCounter = 0;
  mediaNotDownloaded: boolean;
  mediaTestId: string;
  needUpload: boolean;
  toUpload: any;
  players: any;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private testPlayerService: TestPlayerService,
    public _electronService: ElectronService,
    public ngZone: NgZone,
    private location: Location,
    public dialog: MdDialog,
    public sanitizer: DomSanitizer) {
    super(router, mdSnackBar, _electronService);
    this.height = (window.innerHeight);
    this.width = (window.innerWidth);
    //this.hieghtQuestion = (this.height - 100) + 'px';
    //this.heightContentTab = (this.height - 150) + 'px';
    //let h = window.innerHeight;
    let v = this.width;
    let h = this.height;
    if (v < (this.height - 110) * 1.77) {
      v = v;
      h = v / 1.77;
    } else {
      v = (this.height - 110) * 1.77;
      h = v / 1.77 + 110;
    }
    //this.heightQuestionCenter = (this.height - 80) + 'px';
    //this.heightQuestionCenterContent = (this.height - 110) + 'px';
    this.heightQuestionCenter = (h - 80) + 'px';
    this.heightQuestionCenterContent = (h - 110) + 'px';
    //this.hieghtQuestion = (this.height) + 'px';
    //this.heightContentTab = (this.height - 100) + 'px';

    //this.heightQuestionCenter = (h - 80) + 'px';
    //this.heightQuestionCenterContent = (h - 110) + 'px';
    //let v = (this.height) * 1.77;
    //let v = this.width - 10;
    this.widthQuestionCenter = '' + v + 'px';

    this.components = new Array();
    this.result = new TestResult();
    this.canChange = false;
    this.currentQuestionIndex = -1;
    this.currentSlideIndex = -1;
    this.currentSlideName = '';
    this.backgroundColor = '#fff';
    this.preview = true;
    this.stimulusOrderInTest = 0;
    this.stimulusOrderInBlock = 0;
    this.currentBlock = null;
    if (!!this._electronService && this._electronService.remote) {
      this.fs = this._electronService.remote.getGlobal('fs');
    }
    this.needUpload = false;
    this.players = new Array();

  }

  ngOnInit(): void {
    this.allMedias = new Array();
    this.allMedias1 = new Array();
    this.initTest();
    //this.initInputDefault();
    //this.loadMedias().then(() => {
    this.loadTestInfo();
    //});
  }

  initTest() {
    this.test = new Test();
    this.test.options = new Object();
    this.test.questions = new Array<Question>();
    const q = new Question();
    q.slides = new Array<SSlide>();
    this.currentQuestion = q;
    this.currentSlide = new SSlide();
  }

  loadTestInfo() {
    this.route.queryParams.subscribe(params => {
      if (params.preview != undefined && params.preview != null && params.preview == 'false') {
        this.preview = false;
      }

      this.dbTests.findOne({ TestId: params.id }, (err, doc) => {
        this.test = doc;
        // this.testListService.requestGetQuestionInfo(element)
        this.test.questions.forEach((element) => {
          if (element.slides.length > 0) {

            element.slides.forEach((slide) => {
              slide.slideContent.componentArray.forEach((component: any) => {

                if (this.metiaTypes.indexOf(component.componentType) != -1 &&
                component.mediaId != undefined && component.mediaId != null &&
                component.mediaId != 'undefined') {
                  console.log('finding media ' + component.mediaId);

                  this.dbMedias.findOne({ mediaId: component.mediaId }, (err, doc) => {
                    if (!doc) {
                      this.openSnackBar("Medias has not been downloaded completely. Please wait till they download or download test again");
                      this.ngZone.run(() => {
                        this.mediaNotDownloaded = true;
                      })
                    } else {
                      this.allMedias.push(doc);
                      
                      console.log('media found: ' + doc.mediaId);
                    }
                  })
                }
              })
            })
          }
        })
        this.loadMedia().then(() => {
          this.randomizeQuestions();
          if (this.preview) {
            this.startTest();
          } else {
            this.loadUserInfoForm();
          }
        });
      });

    });
  }

  startTest() {
    if (this.questions.length > 0) {
      this.startTestCounter();
      // const firstquestion = this.questions.find((x: any) => x.order === 0);
      this.selectQuestion(this.questions[0]);
      this.currentQuestionIndex = 0;
    }
  }

  loadUserInfoForm() {
    const obj: any = Object.assign({});
    const dialogRef = this.dialog.open(UserInfoComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status == 'OK') {
        const d = res.data;
        this.result.userInfo = d;
        this.startTest();
      }
    });
  }

  closePlayer() {
    this.stopTestCounter();
    this.location.back();
  }


  loadMedia() {
    const promise = new Promise((resolve, reject) => {
      if (this.test != undefined && this.test != null) {
        let promises = new Array();
        for (let q of this.test.questions) {
          promises.push(this.loadMediaQuestion(q));
        }
        Promise.all(promises).then(p => {
          resolve();
        });
        
      } else {
        resolve();
      }
    });
    return promise;
  }

  loadMediaQuestion(question) {
    return new Promise((resolve, reject) => {
      if (question.slides == undefined || question.slides == null) {
        resolve();
        return;
      }
      for (let slide of question.slides) {
        if (slide == undefined || slide == null ||
            slide.slideContent == undefined || slide.slideContent == null ||
            slide.slideContent.componentArray == undefined || slide.slideContent.componentArray == null) {
          resolve();
          return;
        }
        for (let component of slide.slideContent.componentArray) {
          if ( component == undefined || component == null ||
            component.componentType == undefined || component.componentType == null) {
            resolve();
            return;
          }
          if (component.componentType != "VIDEO" && component.componentType != "IMAGE") {
            resolve();
            return;
          }
          this.dbMedias.findOne({ mediaId: component.mediaId },  (err, doc) => {
            if (!doc) {
              resolve();
              return;
            }
            this.allMedias1.push(doc);
            resolve();
          });
        }
      }
    });
  }

  randomizeQuestions() {
    if (this.test.options !== undefined && this.test.options !== null &&
      (this.test.options.randomized === true || this.test.options.randomized === 'true')) {
      /*TODO effettuare la randomizzazione delle domande;*/
      //prima di tutto devo individuare i diversi gruppi;
      let groups = new Array<Object>();
      for (let i = 0; i < this.test.questions.length; i++) {
        const q = this.test.questions[i];
        let rb = '_default_';
        if (q.options !== undefined && q.options !== null) {
          if (q.options.randomizationBlock !== undefined && q.options.randomizationBlock !== null &&
            q.options.randomizationBlock !== '') {
            rb = q.options.randomizationBlock;
          }

          if (q.options.notRandomizeQuestion != undefined && q.options.notRandomizeQuestion != null &&
            (q.options.notRandomizeQuestion == true || q.options.notRandomizeQuestion == 'true')) {
            q.options.notRandomizeQuestion = true;
          } else {
            q.options.notRandomizeQuestion = false;
          }

        }
        if (groups[rb] === undefined || groups[rb] === null) {
          groups[rb] = new Array<Question>();
        }
        groups[rb].push(this.test.questions[i]);
      }

      groups = this.serialize(groups);

      groups.forEach((element) => {
        element['questions'] = this.shuffleArray(element['questions']);
      });

      this.questions = [];
      for (let y = 0; y < groups.length; y++) {
        for (let k = 0; k < groups[y]['questions'].length; k++) {
          const q = groups[y]['questions'][k];
          q.groupIndex = (y + 1);
          q.questionIndexGroup = (k + 1);
          q.groupName = groups[y]['groupName'];
          this.questions.push(q);
        }
      }
      // console.log(this.questions);

    } else {
      this.questions = this.test.questions;
    }
  }

  shuffle(arr) {
    const keys = Object.keys(arr);
    const array = [];
    for (let i = 0; i < keys.length; i++) {
      array[i] = keys[i];
    }
    let currentIndex = keys.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      ret[i] = { 'groupName': array[i], 'questions': arr[array[i]] };
    }
    return ret;
  }

  serialize(arr) {
    const keys = Object.keys(arr);
    const array = [];
    for (let i = 0; i < keys.length; i++) {
      array[i] = keys[i];
    }
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      ret[i] = { 'groupName': array[i], 'questions': arr[array[i]] };
    }
    return ret;
  }

  shuffleArray(arr) {

    let currentIndex = arr.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.

      if (arr[currentIndex].options.notRandomizeQuestion == 'false') {
        arr[currentIndex].options.notRandomizeQuestion = false;
      }
      if (arr[randomIndex].options.notRandomizeQuestion == 'false') {
        arr[randomIndex].options.notRandomizeQuestion = false;
      }
      if (arr[currentIndex].options.notRandomizeQuestion == 'true') {
        arr[currentIndex].options.notRandomizeQuestion = true;
      }
      if (arr[randomIndex].options.notRandomizeQuestion == 'true') {
        arr[randomIndex].options.notRandomizeQuestion = true;
      }
      if (!arr[currentIndex].options.notRandomizeQuestion && !arr[randomIndex].options.notRandomizeQuestion) {
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      }
    }
    return arr;
  }


  selectQuestion(q: Question) {
    if (q == undefined && q == null) {
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.questions[0];
      this.currentQuestionId = this.currentQuestion.questionId;
    } else {
      this.currentQuestion = q;
      this.currentQuestionId = q.questionId;
      this.currentQuestionIndex = this.getCurrentQuestionIndex();
    }
    if (this.currentBlock != q.groupName) {
      this.currentBlock = q.groupName;
      this.stimulusOrderInBlock = 0;
    }
    console.log('selectQuestion');
    this.startQuestionCounter();
    this.initSlides(this.currentQuestion).then(() => {
      this.selectFirstSlide(this.currentQuestion);
    });
  }

  selectFirstSlide(q: Question) {
    if (q != undefined && q != null) {
      if (q.slides != undefined && q.slides != null && q.slides.length > 0) {
        this.currentSlideIndex = -1;
        this.goToNextSlide();
        //this.selectSlide(q.slides[0]);
      }
    }
  }


  completeSlideChange() {
    clearTimeout(this.timer);
    this.timer = null;
    this.currentComponents = this.components[this.currentSlideId];
    console.log('COMPLETE SLIDE CHANGE');
    console.log(JSON.stringify(this.components));
    console.log('slide id:' + this.currentSlideId);
    console.log(JSON.stringify(this.currentComponents));
    this.startSlideCounter();
    this.checkSlideAction();
  }

  setSlideConfig() {
    if (this.currentSlide.options != undefined && this.currentSlide.options != null &&
      this.currentSlide.options.color != undefined && this.currentSlide.options.color != null) {
      this.backgroundColor = this.currentSlide.options.color;
    } else {
      this.backgroundColor = '#fff';
    }
    if (this.currentSlide.options != undefined && this.currentSlide.options != null &&
      this.currentSlide.options.name != undefined && this.currentSlide.options.name != null) {
      this.currentSlideName = this.currentSlide.options.name;
    } else {
      this.currentSlideName = '';
    }
  }

  cleanAllPlayers() {
    console.log('CLEAN PLAYERS');
    if (this.players == null || this.players == null) {
      this.players = new Array();
    }
    for (let key in this.players) {
      try {
        this.players[key].pause();
      } catch(err) {
        console.log('CLEAN PLAYERS ERROR ' + err.message);
      }
    }
  }

  changeSlide(i: number) {
    /*if (!this.canChange) {
      return;
    }*/
    //this.cleanAllPlayers();
    console.log('CHANGE SLIDE');
    if (i < this.currentQuestion.slides.length) {
      this.currentSlide = this.currentQuestion.slides[i];
      this.currentSlideIndex = i;
      this.currentSlideId = this.currentSlide.slideId;
      this.setSlideConfig();
    }
    this.completeSlideChange();
  }

  initSlides(question: Question) {
    return new Promise((resolve, reject) => {
      console.log('initSlides');
        let promises = new Array();
          for (let i = 0; i < question.slides.length; i++) {
            console.log('convert slides');
            let prom = this.convertComponents(question.slides[i]);
            promises.push(prom);
            prom.then((ret) => {
              this.ngZone.run(() => {
                this.components[question.slides[i].slideId] = ret;
              });
            });
          }
          Promise.all(promises).then(p => {
            resolve();
          });
    });
  }
  trackByFn(index, item) {
    return index;
  }
  convertComponents(slide) {
    const promise = new Promise((resolve, reject) => {
      console.log('convertComponents');
      if (slide == undefined || slide == null ||
        slide.slideContent == undefined || slide.slideContent == null ||
        slide.slideContent.componentArray == undefined || slide.slideContent.componentArray == null) {
        return new Array<SComponent>();
      }
      const ret = new Array<SComponent>();
      const sw = jQuery('#s-content').innerWidth();
      const sh = jQuery('#s-content').innerHeight();
      for (let i = 0; i < slide.slideContent.componentArray.length; i++) {
        const comp = new SComponent();
        comp.fromSComp(slide.slideContent.componentArray[i], sw, sh);
        slide.slideContent.componentArray[i].id = comp.id;
        if (comp.mediaId != undefined && comp.mediaId != null && comp.mediaId.trim() != '') {
          //comp.url = this.getMediaUrlFromId(comp.componentType, comp.mediaId);
          const media = this.getMediaFromId(comp.componentType, comp.mediaId);
          /*if (comp.componentType == SCompType.VIDEO) {
            comp.url = Baseconst.getPartialBaseUrl() + '/retrievePublic?code=' + media.publicUrl;
          }*/
          console.log('media found: ' + JSON.stringify(media));
          comp.localUrl = media.localUrl;
        }
        ret.push(comp);
      }
      resolve(ret);
    });
    return promise;
  }

  private getMediaUrlFromId(type, mediaId) {
    //TODO qui è necessario effettuare la ricerca del media;
    if (mediaId == undefined || mediaId == null) {
      return null;
    }
    for (const media of this.allMedias) {
      if (media.mediaId == mediaId) {
        return media.mediaPath;
      }
    }
    // console.log(type + ' ' + mediaId);
    return '';
  }

  private getMediaFromId(type, mediaId) {
    let mediaComp;
    if (mediaId == undefined || mediaId == null) {
      mediaComp = null;
    }
    /*for (const media of this.allMedias) {
      if (media.mediaId == mediaId) {
        mediaComp = media;
      }
    }*/
    mediaComp = this.allMedias.find((el) => {
      return el.mediaId == mediaId;
    })
    // console.log(type + ' ' + mediaId);
    return mediaComp;
  }


  getCurrentSlide() {
    const question = this.getCurrentQuestion();
    for (let i = 0; i < question.slides.length; i++) {
      if (question.slides[i].slideId == this.currentSlideId) {
        this.ngZone.run(() => {
          return question.slides[i];
        });
      }
    }
  }

  getCurrentQuestion() {
    for (let y = 0; y < this.questions.length; y++) {
      if (this.questions[y].questionId == this.currentQuestionId) {
        this.ngZone.run(() => {
          return this.questions[y];
        });
      }
    }
    return null;
  }

  getCurrentQuestionIndex() {
    for (let y = 0; y < this.questions.length; y++) {
      if (this.questions[y].questionId == this.currentQuestionId) {
        // this.ngZone.run(() => {
        //   return y;
        // });
        return y;
      }
    }
    return null;
  }


  backQuestion() {
    this.stopTestCounter();
    // this.testPlayerService.requestCreateReport(this.result).subscribe(res => {
    //   console.log(res);
    //   if (res.status == 'OK') {
    //     this.test = res.response;
    //     console.log('TEST ENDED');
    //     this.openSnackBar('TEST ENDED!!!');
    //     clearTimeout(this.timer);
    //     this.timer = null;
    //     const navigationExtras: NavigationExtras = {
    //       queryParams: {
    //         id: this.test.TestId
    //       }
    //     };
    //     this.router.navigate(['/home/atlas/testedit'], navigationExtras);
    //   } else {
    //     this.processStatusError(res.errors);
    //     console.error('Server error');
    //   }
    // });
    const result = Object.assign({ 'synced': 0, 'needUpload': this.needUpload }, this.result);

    this.dbReports.insert(result, (err, newDocs) => {
      if (this.needUpload) {
        this.toUpload.reportId = newDocs._id;
        this.dbReportVideos.insert(this.toUpload, (err1, newDocs1) => {
          console.log(JSON.stringify(newDocs1));
        });
      }
    });

  }



  ngAfterViewInit() {
    this.ngZone.run(() => {
      this.components = this.components;
    });
    // this.initDragDropComponent();
    // jQuery('#drag-component').draggable();
  }

  checkTransition(c: SComponent, $event) {
    console.log('checkTransition');
    if (c === undefined || c === null
      || c.componentType === undefined || c.componentType === null
      || c.options === undefined || c.options === null) {
      return;
    }
    switch (c.componentType) {
      case SCompType.TEXT:
      case SCompType.TEXTAREA:
        this.checkTransitionText(c, $event);
        break;
      case SCompType.RADIO:
      case SCompType.CHECKBOX:
      case SCompType.CLICK_AREA:
      case SCompType.CUSTOM_CLICK_AREA:
      case SCompType.BUTTON:
      case SCompType.VIDEO_RECORD:
      case SCompType.IMAGE:
        this.checkTransitionCheckbox(c, $event);
        break;
      default:
        break;
    }
  }

  checkTransitionText(c: SComponent, $event) {
    if (c == undefined || c == null
      || c.componentType == undefined || c.componentType == null
      || c.options == undefined || c.options == null) {
      return;
    }
    if ($event.key != 'Enter') {
      return;
    }
    if (c.transition == undefined || c.transition == null) {
      return;
    }
    if (c.transition == true) {
      this.performTransition();
    }
  }

  checkTransitionCheckbox(c: SComponent, $event) {
    if (c == undefined || c == null
      || c.componentType == undefined || c.componentType == null
      || c.options == undefined || c.options == null) {
      return;
    }
    if (c.transition == undefined || c.transition == null) {
      return;
    }
    if (c.transition == true) {
      this.performTransition();
    }
  }

  performTransition() {
    this.currentComponents = [];
    this.stopSlideCounter();
    clearTimeout(this.timer);
    this.cleanAllPlayers();
    this.timer = null;
    setTimeout(() => {
      if (this.currentSlideIndex != undefined && this.currentSlideIndex != null) {
        this.goToNextSlide();
      } else {
        //si deve gestire il caso in cui, per qualche motivo, non viene incrementato l'indice;
      }
    }, 200);

  }

  goToNextSlide() {
    if (this.currentSlideIndex < (this.currentQuestion.slides.length - 1)) {
      //ci sono altre slides
      this.changeSlide(this.currentSlideIndex + 1);
    } else {
      this.stopQuestionCounter();
      this.goToNextQuestion();
    }
  }

  startRecording(c) {
    this.initMediaTestId();
    const d = this.dialog.open(WebcamDialogComponent, {
      panelClass: 'webcam-dialog',
      data: {
        mediaTestId: this.mediaTestId,
      }
    });
    d.afterClosed().subscribe((data) => {
      console.log('TESTPLAYER after close');
      if (data && data['name']) {
        console.log('TESTPLAYER fileName ' + data['name']);
        this.needUpload = true;
        console.log('TESTPLAYER webcamChange ');
        this.webcamChange(c, data['name'], {response : {mediaId: 'ID_-_' + data['name'] + '_-_'}});
        console.log('TESTPLAYER webcamChanged ');
        if (this.toUpload == undefined || this.toUpload == null) {
          this.toUpload = {};
        }
        if (this.toUpload.files == undefined || this.toUpload.files == null) {
          this.toUpload.files = new Array();
        }
        console.log('TESTPLAYER pushing... ');
        this.toUpload.files.push(data['name']);
        console.log('TESTPLAYER toUpload ' + JSON.stringify(this.toUpload));

      }
    });
  }

  initMediaTestId() {
    this.route.queryParams.subscribe(params => {
      this.mediaTestId = params.id
    });
  }

  webcamChange(comp, fileItem, response) {
    console.log(comp, fileItem, response)


    if (comp.notToSave !== undefined && (comp.notToSave === 'true' || comp.notToSave === true)) {
      return;
    }

    if (!this.resultQuestion.directAnswer) {
      this.resultQuestion.directAnswer = {};
    }

    if (this.resultQuestion.directAnswer[comp.name] === undefined ||
      this.resultQuestion.directAnswer[comp.name] === null) {
      this.resultQuestion.directAnswer[comp.name] = {};
    }
    if (this.resultQuestion.directAnswer[comp.name][comp.id] === undefined ||
      this.resultQuestion.directAnswer[comp.name][comp.id] === null) {
      this.resultQuestion.directAnswer[comp.name][comp.id] = [];
    }

    const json = { id: response.response.mediaId, filename: fileItem, name: comp.name, type: comp.componentType };
    this.resultQuestion.directAnswer[comp.name][comp.id] = json;

    //this.result.questions[this.currentQuestionIndex] = this.resultQuestion;
  }

  goToNextQuestion() {
    // this.cleanAllPlayers();
    setTimeout(() => {
      if (this.currentQuestionIndex === undefined && this.currentQuestionIndex === null) {
        this.currentQuestionIndex = -1;
      }
      if (this.currentQuestionIndex < (this.questions.length - 1)) {
        this.selectQuestion(this.questions[this.currentQuestionIndex + 1]);
      } else {
        this.stopTestCounter();

        let result = Object.assign({ 'synced': 0, 'needUpload': this.needUpload  }, this.result);
        result = this.fixCharactersProblems(result);
        console.log('CLOSING TEST ' + JSON.stringify(result));
        this.dbReports.insert(result, (err, newDocs) => {
          console.log('CLOSING TEST INSERTED ' + JSON.stringify(newDocs));
          console.log('CLOSING TEST INSERTED error???' + JSON.stringify(err));
          if (newDocs != undefined){
            if (this.needUpload) {
              this.toUpload.reportId = newDocs._id;
              this.dbReportVideos.insert(this.toUpload, (err1, newDocs1) => {
                console.log(JSON.stringify(newDocs1));
              });
            }
          } else {
            if (err != undefined && err != null) {
              this.openSnackBar('Error saving report: ' + err.message);
            } else {
              this.openSnackBar('Error saving report');
            }
          }          
        });
        // console.log('TEST ENDED');
        this.openSnackBar('TEST ENDED!!!');
        setTimeout(() => {
          this.router.navigate(['/report']);
        }, 200);
      }
    }, 200);
  }

  fixCharactersProblems(report) {
    console.log(report);
    let ret = report;
    if (Array.isArray(ret)) {
      if (ret.length > 0) {
        for (let i = 0; i < ret.length; i++) {
          if (typeof(ret[i]) === "object") {
            ret[i] = this.fixCharactersProblems(ret[i]);
          }
        }
      } else if (Object.keys(ret).length) {
        for (let prop in ret) {
          if (Object.prototype.hasOwnProperty.call(ret, prop)) {
            ret[prop] = this.fixCharactersProblems(ret[prop]);
          }
        }
      }
    } else {
        for (let prop in ret) {
          if (Object.prototype.hasOwnProperty.call(ret, prop)) {
            console.log(prop);
              let toSubstitute = false;
              let newProp = prop;
              if (prop.indexOf('.') > -1) {
                toSubstitute = true;
                newProp = newProp.replace(/\./g, '-_-|-_-');
              }
              if (prop.indexOf('$') > -1 ) {
                toSubstitute = true;
                newProp = newProp.replace(/\$/g, '-_-!-_-');
              }
              if (toSubstitute) {
                delete Object.assign(ret, {[newProp]: ret[prop] })[prop];
              }
              if (typeof(ret[newProp]) === "object") {
                ret[newProp] = this.fixCharactersProblems(ret[newProp]);
              }
          }
      }
    }
  return ret;
  }

  checkSlideAction() {
    if (this.currentSlide.transitionType != undefined && this.currentSlide.transitionType != null) {
      for (const t of this.currentSlide.transitionType) {
        if (t == TransitionType.time &&
          this.currentSlide.options != undefined && this.currentSlide.options != null &&
          this.currentSlide.options.seconds != undefined && this.currentSlide.options.seconds != null &&
          this.currentSlide.options.seconds > 0) {
          const millisec = this.currentSlide.options.seconds * 1000;
          this.timer = setTimeout(() => {
            this.performTransition();
          }, millisec);
        }
      }
    }
  }
  onPlayerReady($event, cid, c) {
    this.players[cid] = $event;
    if (c != undefined && c != null &&
      c.options != undefined && c.options != null &&
      ((c.options.autoplay != undefined && c.options.autoplay != null &&
      c.options.autoplay == 'true') || 
      (c.options.commands != undefined && c.options.commands != null &&
        c.options.commands == 'false'))) {
        $event.play();
      }
  }
  onUpdateState($event, cid, c) {
    if ($event.type == 'play') {
      for (let key in this.players) {
        if (key !== cid) {
            this.players[key].pause();
        }
      }
    }
  }

  startTestCounter() {
    this.result.testId = this.test.TestId;
    this.result.testName = this.test.TestName;
    this.result.piId = ''; // TODO inserire l'id utente
    this.result.questions = new Array<QuestionResult>();
    this.result.testStartTime = (new Date()).getTime();
    // console.log('start test: ' + (new Date()).getTime());
  }
  startQuestionCounter() {
    this.resultQuestion = new QuestionResult();
    this.resultQuestion.directAnswer = {};
    this.resultQuestion.expectedAnswer = {};
    this.resultQuestion.randomizationBlock = this.currentQuestion.groupName;
    this.resultQuestion.randomizationPresentationBlock = '' + this.currentQuestion.questionIndexGroup;
    this.resultQuestion.questionId = this.currentQuestion.questionId;
    // console.log('start question: ' + (new Date()).getTime());
  }
  startSlideCounter() {
    // console.log('start slide: ' + (new Date()).getTime());
    if (this.currentSlide.type == SlideType.STIMULUS) {
      this.stimulusOrderInBlock++;
      this.stimulusOrderInTest++;
      this.resultQuestion.stimulusSlideId = this.currentSlide.slideId;
      this.resultQuestion.stimulusSlideNumber = this.currentSlideIndex;
      this.resultQuestion.stimulusOrderInBlock = this.stimulusOrderInBlock;
      this.resultQuestion.stimulusOrderInTest = this.stimulusOrderInTest;
      this.resultQuestion.stimulusStartTime = (new Date()).getTime();
    }
    if (this.currentSlide.type == SlideType.ANSWER) {
      this.resultQuestion.answerStartTime = (new Date()).getTime();
      this.resultQuestion.answerSlideId = this.currentSlide.slideId;

    }
  }
  stopTestCounter() {
    this.result.testEndTime = (new Date()).getTime();

    // var result = Object.assign({'synced':0},this.result);

    // this.dbReports.insert(result, (err, newDocs) =>{
    //     console.log(newDocs);
    // });

    // console.log('stop test: ' + (new Date()).getTime());
    // console.log(this.result);
  }
  stopQuestionCounter() {
    this.result.questions.push(this.resultQuestion);
    console.log('stop question: ' + JSON.stringify(this.result));
  }
  stopSlideCounter() {
    if (this.currentSlide.type == SlideType.STIMULUS) {
      this.resultQuestion.stimulusEndTime = (new Date()).getTime();
    }
    if (this.currentSlide.type == SlideType.ANSWER) {
      this.resultQuestion.expectedAnswer = this.getExpectedAnswer();
      this.getCurrentAnswer();
      this.resultQuestion.answerEndTime = (new Date()).getTime();
    }
    // console.log('stop slide: ' + (new Date()).getTime());
  }

  getExpectedAnswer(): any {
    const ret = {};
    for (let i = 0; i < this.currentSlide.slideContent.componentArray.length; i++) {
      const c = this.currentSlide.slideContent.componentArray[i];
      if (c.componentType == SCompType.RADIO) {
        for (let y = 0; y < c.options.numRadio; y++) {
          if (c.options['radioComponentIsCorrect_' + y] == 'true') {
            ret[c.options.groupName] = {};
            ret[c.options.groupName].label = c.options['radioComponentLabel_' + y];
            ret[c.options.groupName].value = c.options['radioComponentValue_' + y];
          }
        }
      }
      if (c.options) {
        if (c.options.isCorrect == 'true') {
          let n = '';
          if (c.options.groupName != undefined && c.options.groupName != null) {
            n = c.options.groupName;
          }
          if (c.options.name != undefined && c.options.name != null) {
            n = c.options.name;
          }
          if (c['name'] != undefined && c['name'] != null) {
            n = c['name'];
          }
          ret[n] = {};
          if (c.options.label != undefined && c.options.label != null) {
            ret[n].label = c.options.label;
          } else {
            ret[n].label = n;
          }
          ret[n].value = c.options.value;
        }
      }
    }
    return ret;
  }
  getCurrentAnswer() {
    this.currentSlide.slideContent.componentArray.forEach(comp => {
      this.ngZone.run(() => {
        switch (comp.componentType) {
          case SCompType.TEXT:
          case SCompType.TEXTAREA:
            this.textChange(comp);
            break;
          case SCompType.CHECKBOX:
            break;
          case SCompType.RADIO:
            break;
          case SCompType.IMAGE:
            //this.imageChange(comp);
            break;
          case SCompType.CLICK_AREA:
            //this.clickareaChange(comp);
            break;
          case SCompType.CUSTOM_CLICK_AREA:
            //this.clickareaChange(comp);
            break;
          case SCompType.RANGE:
            // this.rangeChange(comp);
            break;
          default:
            break;
        }
      });
    });
  }

  textChange(c) {
    if (c.options.notToSave != undefined && (c.options.notToSave == 'true' || c.options.notToSave == true)) {
      return;
    }
    setTimeout(() => {
      const t = jQuery('#' + c.id).val();
      let name = c.options.name;
      if (name == undefined || name == null)
        name = c.groupName;
      if (name == undefined || name == null)
        name = c.name;
      if (this.resultQuestion.directAnswer[name] === undefined ||
        this.resultQuestion.directAnswer[name] === null) {
        this.resultQuestion.directAnswer[name] = {};
      }
      if (this.resultQuestion.directAnswer[name][c.id] === undefined ||
        this.resultQuestion.directAnswer[name][c.id] === null) {
        this.resultQuestion.directAnswer[name][c.id] = {};
      }
      this.resultQuestion.directAnswer[name][c.id].value = t;
      this.resultQuestion.directAnswer[name][c.id].name = name;
    }, 100);
  }

  textAreaChange(c, event) {

    console.log(c)
    if (c.notToSave != undefined && (c.notToSave == 'true' || c.notToSave == true)) {
      return;
    }

    if (c.groupName == undefined || c.groupName == null)
      c.groupName = c.name;

    if (this.resultQuestion.directAnswer[c.groupName] === undefined ||
      this.resultQuestion.directAnswer[c.groupName] === null) {
      this.resultQuestion.directAnswer[c.groupName] = {};
    }
    if (this.resultQuestion.directAnswer[c.groupName][c.id] === undefined ||
      this.resultQuestion.directAnswer[c.groupName][c.id] === null) {
      this.resultQuestion.directAnswer[c.groupName][c.id] = {};
    }

    setTimeout(() => {
      const t = jQuery('#' + c.id).val();
      this.resultQuestion.directAnswer[c.groupName][c.id].value = t;
      this.resultQuestion.directAnswer[c.groupName][c.id].name = c.groupName;
    }, 100);


  }

  checkboxChange(comp) {
    if (comp.notToSave != undefined && (comp.notToSave == 'true' || comp.notToSave == true)) {
      return;
    }
    // console.log(comp);
    if (this.resultQuestion.directAnswer[comp.groupName] == undefined ||
      this.resultQuestion.directAnswer[comp.groupName] == null) {
      this.resultQuestion.directAnswer[comp.groupName] = {};
    }
    if (this.resultQuestion.directAnswer[comp.groupName][comp.id] == undefined ||
      this.resultQuestion.directAnswer[comp.groupName][comp.id] == null) {
      this.resultQuestion.directAnswer[comp.groupName][comp.id] = { isChecked: false };
    }
    if (this.resultQuestion.directAnswer[comp.groupName][comp.id].isChecked == false) {
      this.resultQuestion.directAnswer[comp.groupName][comp.id].isChecked = true;
      this.resultQuestion.directAnswer[comp.groupName][comp.id].value = comp.value;
    } else {
      this.resultQuestion.directAnswer[comp.groupName][comp.id].isChecked = false;
      this.resultQuestion.directAnswer[comp.groupName][comp.id].value = null;
    }

    this.resultQuestion.directAnswer[comp.groupName][comp.id].name = comp.groupName;
  }

  checkbuttonChange(comp) {
    // console.log(comp);
    if (comp.notToSave != undefined && (comp.notToSave == 'true' || comp.notToSave == true)) {
      return;
    }
    if (this.resultQuestion.directAnswer[comp.name] == undefined ||
      this.resultQuestion.directAnswer[comp.name] == null) {
      this.resultQuestion.directAnswer[comp.name] = {};
      this.resultQuestion.directAnswer[comp.name][comp.id] = {};
    }

    if (this.resultQuestion.directAnswer[comp.name][comp.id] == undefined ||
      this.resultQuestion.directAnswer[comp.name][comp.id] == null) {
      this.resultQuestion.directAnswer[comp.name][comp.id] = {};
    }

    this.resultQuestion.directAnswer[comp.name][comp.id].value = comp.value;
    this.resultQuestion.directAnswer[comp.name][comp.id].type = comp.componentType;
  }

  radioChange(comp, elem) {
    if (comp.notToSave != undefined && (comp.notToSave == 'true' || comp.notToSave == true)) {
      return;
    }

    if (this.resultQuestion.directAnswer[comp.groupName] == undefined ||
      this.resultQuestion.directAnswer[comp.groupName] == null) {
      this.resultQuestion.directAnswer[comp.groupName] = {};
    }
    // else{
    //   this.resultQuestion.directAnswer[comp.groupName][comp.id].groupName = comp.options.groupName;
    // }
    if (this.resultQuestion.directAnswer[comp.groupName][comp.id] == undefined ||
      this.resultQuestion.directAnswer[comp.groupName][comp.id] == null) {
      this.resultQuestion.directAnswer[comp.groupName][comp.id] = { isSelected: false };
    }

    this.resultQuestion.directAnswer[comp.groupName][comp.id].isSelected = true;
    this.resultQuestion.directAnswer[comp.groupName][comp.id].value = elem.value;
    // this.resultQuestion.directAnswer[comp.groupName][comp.id].name = elem.value;
    this.resultQuestion.directAnswer[comp.groupName][comp.id].name = comp.groupName;

  }

  imageChange(comp) {
    
    if (comp.options.checkable != 'true' && comp.options.checkable != true) {
      return;
    }
    if (this.resultQuestion.directAnswer[comp.name] == undefined ||
      this.resultQuestion.directAnswer[comp.name] == null) {
      this.resultQuestion.directAnswer[comp.name] = {};
      // this.resultQuestion.directAnswer[comp.name].name = comp.name;
    }
    if (this.resultQuestion.directAnswer[comp.name][comp.id] == undefined ||
      this.resultQuestion.directAnswer[comp.name][comp.id] == null) {
      this.resultQuestion.directAnswer[comp.name][comp.id] = { isChecked: false };
    }
    if (this.resultQuestion.directAnswer[comp.name][comp.id].isChecked == false) {
      comp.options.isChecked = true;
      this.resultQuestion.directAnswer[comp.name][comp.id].isChecked = true;
      this.resultQuestion.directAnswer[comp.name][comp.id].value = comp.value;
    } else {
      comp.options.isChecked = false;
      this.resultQuestion.directAnswer[comp.name][comp.id].isChecked = false;
      this.resultQuestion.directAnswer[comp.name][comp.id].value = null;
    }
    this.resultQuestion.directAnswer[comp.name][comp.id].name = comp.name;
    console.log('image change ' + JSON.stringify(this.resultQuestion.directAnswer));
  }

  clickareaChange(comp) {
    if (comp.notToSave != undefined && (comp.notToSave == 'true' || comp.notToSave == true)) {
      return;
    }
    if (this.resultQuestion.directAnswer[comp.groupName] == undefined ||
      this.resultQuestion.directAnswer[comp.groupName] == null) {
      this.resultQuestion.directAnswer[comp.groupName] = {};
      this.resultQuestion.directAnswer[comp.groupName][comp.id] = {};
    }

    this.resultQuestion.directAnswer[comp.groupName][comp.id].value = comp.value;
    this.resultQuestion.directAnswer[comp.groupName][comp.id].name = comp.groupName;
  }

  rangeChange(comp, event) {
    if (comp.notToSave != undefined && (comp.notToSave == 'true' || comp.notToSave == true)) {
      return;
    }
    if (this.resultQuestion.directAnswer[comp.name] == undefined ||
      this.resultQuestion.directAnswer[comp.name] == null) {
      this.resultQuestion.directAnswer[comp.name] = {};
      this.resultQuestion.directAnswer[comp.name][comp.id] = {};
    }
    // this.resultQuestion.directAnswer[comp.name][comp.id] = {};
    // console.log(comp);
    this.resultQuestion.directAnswer[comp.name][comp.id].value = event.target.value;
    this.resultQuestion.directAnswer[comp.name][comp.id].name = comp.name;

  }


  getTicks(c) {
    const ret = new Array<any>();
    if (c == null) {
      return ret;
    }
    if (c['ticks'] != undefined && c['ticks'] != null)
      return c['ticks'];
    if (c.min == undefined || c.min == null ||
      c.max == undefined || c.max == null ||
      c.step == undefined || c.step == null) {
      return ret;
    }

    const min = parseInt(c.min, 10);
    const max = parseInt(c.max, 10);
    const step = parseInt(c.step, 10);

    for (let i = min; i <= max; i = i + step) {
      const v = { 'value': i };
      ret.push(v);
    }
    c['ticks'] = ret;
    return ret;

  }

  getLabels(c) {
    const ret = new Array<any>();
    if (c == null) {
      return ret;
    }
    if (c['labels'] != undefined && c['labels'] != null)
      return c['labels'];
    if (c.options == undefined || c.options == null ||
      c.options.labelNum == undefined || c.options.labelNum == null)
      return ret;

    const num = parseInt(c.options.labelNum, 10);
    for (let i = 0; i < num; i++) {
      const v = { 'label': c.options['label_' + i] };
      ret.push(v);
    }
    c['labels'] = ret;
    return ret;
  }

  setActiveImg(i) {
    this.selectHighlight = i;
  }
  buildMediaPath(base, testId, mediaId, extension, toCreate) {
    const folderPath =  base + '/medias/' + testId;
    const filePath = '/' + mediaId + '.' + extension;
    if (toCreate) {
      if (!this.fs.existsSync(folderPath)) {
        this.fs.mkdirSync(folderPath);
      }
    }
    return folderPath + filePath;
  }
  getMedia(component) {

    let body;
    if (component.componentType === 'VIDEO') {
      body = this.buildMediaPath(this.base_path, this.test.TestId, component.mediaId, 'mp4', false);
      //body = this.base_path + '/medias/' + component.mediaId + '.mp4';
    } else {
      body = this.buildMediaPath(this.base_path, this.test.TestId, component.mediaId, 'jpg', false);
      //body = this.base_path + '/medias/' + component.mediaId + '.jpg';
    }
    if (component.localUrl != undefined && component.localUrl != null) {
      body = component.localUrl;
    }
    // console.log(this.base_path);
    return body.toString();

    // this.getMediaContent(component).then((data) => {
    //   return data;
    // });
  }

  getMediaContent(component) {
    const promise = new Promise((resolve, reject) => {
      if (!!this.fs) {
        this.fs.readFile(this.base_path + '/medias/' + component.mediaId, 'utf8', function (err, data) {
          if (err) reject(err);
          resolve(data);
        });


      }
    });
    return promise;
  }

  sanitize(path: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
  sanitizeImg(path: string) {
    return this.sanitizer.bypassSecurityTrustUrl(path);
  }
}
