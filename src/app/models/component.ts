import { TransitionType } from './question';

declare var jQuery: any;

export class SComponent {
  componentType: string;
  id: string;
  mediaId: string;
  pos: string;
  posX: number;
  posY: number;
  dim: string;
  dimHeight: number;
  dimWidth: number;
  percHeight: number;
  percWidth: number;
  options: any;
  name: string;
  value: string;
  label: string;
  text: string;
  htmlText: string;
  groupName: string;
  chars: number;
  transition: boolean;
  isCorrect: boolean;
  canPause: boolean;
  url: string;
  cols: number;
  rows: number;
  isResizable: boolean;
  min: number;
  max: number;
  step: number;
  showStep: boolean;
  numRadio: number;
  radioComponent: Array<SRadioComponent>;
  tableComponent: Array<Array<STableComponent>>;
  checkedString: string;
  localUrl: string;

  toSComp(sw: number, sh: number): SComp {
    const comp = new SComp();
    comp.componentType = SCompType[this.componentType.toLocaleUpperCase()];
    comp.mediaId = this.mediaId;
    comp.pos = this.convertPositionAbsToPerc(sw, sh);
    if ((this.percWidth == undefined || this.percHeight == undefined ||
      this.percWidth == null || this.percHeight == null) &&
      (this.dimHeight != undefined && this.dimHeight != null &&
        this.dimWidth != undefined && this.dimWidth != null)) {
      this.percHeight = this.dimHeight * 100 / sh;
      this.percWidth = this.dimWidth * 100 / sw;
    }
    comp.dim = this.percWidth + ',' + this.percHeight;
    comp.options = {};
    if (this.name != undefined && this.name != null && this.name.trim() != '') {
      comp.options.name = this.name;
    }
    if (this.value != undefined && this.value != null && this.value.trim() != '') {
      comp.options.value = this.value;
    }
    if (this.label != undefined && this.label != null && this.label.trim() != '') {
      comp.options.label = this.label;
    }
    if (this.text != undefined && this.text != null && this.text.trim() != '') {
      comp.options.text = this.text;
    }
    if (this.htmlText != undefined && this.htmlText != null && this.htmlText.trim() != '') {
      comp.options.htmlText = this.htmlText;
    }
    if (this.groupName != undefined && this.groupName != null && this.groupName.trim() != '') {
      comp.options.groupName = this.groupName;
    }
    if (this.transition != undefined && this.transition != null) {
      if (this.transition) {
        comp.options.transition = 'true';
      } else {
        comp.options.transition = 'false';
      }
    }
    if (this.isCorrect != undefined && this.isCorrect != null) {
      if (this.isCorrect) {
        comp.options.isCorrect = 'true';
      } else {
        comp.options.isCorrect = 'false';
      }
    }
    if (this.canPause != undefined && this.canPause != null) {
      if (this.canPause) {
        comp.options.canPause = 'true';
      } else {
        comp.options.canPause = 'false';
      }
    }
    if (this.cols != undefined && this.cols != null && this.cols > 0) {
      comp.options.cols = '' + this.cols;
    }
    if (this.rows != undefined && this.rows != null && this.rows > 0) {
      comp.options.rows = '' + this.rows;
    }
    if (this.chars != undefined && this.chars != null && this.chars > 0) {
      comp.options.chars = '' + this.chars;
    }
    if (this.min != undefined && this.min != null) {
      comp.options.min = '' + this.min;
    }
    if (this.max != undefined && this.max != null) {
      comp.options.max = '' + this.max;
    }
    if (this.step != undefined && this.step != null && this.step > 0) {
      comp.options.step = '' + this.step;
    }
    if (this.showStep != undefined && this.showStep != null) {
      if (this.showStep) {
        comp.options.showStep = 'true';
      } else {
        comp.options.showStep = 'false';
      }
    }

    if (this.options != undefined && this.options != null) {
      for (const key of Object.keys(this.options)) {
        comp.options[key] = this.options[key];
      }
    }

    if (comp.options.fsize != undefined && comp.options.fsize != null) {
      comp.options.fsize = '' + comp.options.fsize;
    }

    if (this.radioComponent != undefined && this.radioComponent != null) {
      comp.options.numRadio = this.radioComponent.length;
      for (let i = 0; i < this.radioComponent.length; i++) {
        const c = this.radioComponent[i];
        comp.options['radioComponentLabel_' + i] = c.label;
        comp.options['radioComponentValue_' + i] = '' + c.value;
        // if(c.isCorrect == true){
        //   comp.options['radioComponentIsCorrect_' + i] = 'true';
        // } else {
        //   comp.options['radioComponentIsCorrect_' + i] = 'false';
        // }
      }
    }

    if (this.tableComponent) {

      comp.options.numTableRowLabel = this.tableComponent[0].length;
      for (let i = 0; i < this.tableComponent[0].length; i++) {
        const c = this.tableComponent[0][i];
        comp.options['tableComponentRowLabel_' + i] = c.label;
        comp.options['tableComponentRowLimit_' + i] = c.limit;
      }
      // -------
      comp.options.numTableColLabel = this.tableComponent[1].length;
      for (let i = 0; i < this.tableComponent[1].length; i++) {
        const c = this.tableComponent[1][i];
        comp.options['tableComponentColLabel_' + i] = c.label;
        comp.options['tableComponentColLimit_' + i] = c.limit;
      }
      // -------
      comp.options.checkedString = this.checkedString;

      // console.log(comp);
      // console.log('sw'+sw);
      // console.log('sh'+sh);


    }
    if (this.localUrl != undefined && this.localUrl != null && this.localUrl.trim() != '') {
      comp.localUrl = this.localUrl;
    }


    return comp;
  }

  fromSComp(comp: SComp, sw: number, sh: number, step = null) {


    this.componentType = '' + comp.componentType;
    this.id = 'input_' + Math.floor(Math.random() * 300) + new Date().getTime();
    this.mediaId = comp.mediaId;
    this.pos = comp.pos;
    this.convertPositionPercToAbs(sw, sh, step);
    this.dim = comp.dim;
    this.convertDimensionPercToAbs(sw, sh);
    this.options = {};
    //    console.log(ngZone);
    // ngZone.run(()=>{
    for (const key of Object.keys(comp.options)) {
      this.options[key] = comp.options[key];
    }

    if (comp.options.name != undefined && comp.options.name != null && comp.options.name.trim() != '') {
      this.name = comp.options.name;
      delete this.options.name;
    }
    if (comp.options.value != undefined && comp.options.value != null && comp.options.value.trim() != '') {
      this.value = comp.options.value;
      delete this.options.value;
    }
    if (comp.options.label != undefined && comp.options.label != null && comp.options.label.trim() != '') {
      this.label = comp.options.label;
      delete this.options.label;
    }
    if (comp.options.text != undefined && comp.options.text != null && comp.options.text.trim() != '') {
      this.text = comp.options.text;
      delete this.options.text;
    }
    if (comp.options.htmlText != undefined && comp.options.htmlText != null && comp.options.htmlText.trim() != '') {
      this.htmlText = comp.options.htmlText;
    }
    if (comp.options.groupName != undefined && comp.options.groupName != null && comp.options.groupName.trim() != '') {
      this.groupName = comp.options.groupName;
      delete this.options.groupName;
    }
    if (comp.options.transition != undefined && comp.options.transition != null) {
      if (comp.options.transition == 'true') {
        this.transition = true;
      } else {
        this.transition = false;
      }
      delete this.options.transition;
    }
    if (comp.options.scrollable != undefined && comp.options.scrollable != null) {
      if (comp.options.scrollable == 'true') {
        this.options.scrollable = true;
      } else {
        this.options.scrollable = false;
      }
    }
    if (comp.options.isCorrect != undefined && comp.options.isCorrect != null) {
      if (comp.options.isCorrect == 'true') {
        this.isCorrect = true;
      } else {
        this.isCorrect = false;
      }
      delete this.options.isCorrect;
    }
    if (comp.options.canPause != undefined && comp.options.canPause != null) {
      if (comp.options.canPause == 'true') {
        this.canPause = true;
      } else {
        this.canPause = false;
      }
      delete this.options.canPause;
    }
    if (comp.options.cols != undefined && comp.options.cols != null && comp.options.cols > 0) {
      this.cols = comp.options.cols;
      delete this.options.cols;
    }
    if (comp.options.rows != undefined && comp.options.rows != null && comp.options.rows > 0) {
      this.rows = comp.options.rows;
      delete this.options.rows;
    }

    if (comp.options.chars != undefined && comp.options.chars != null && comp.options.chars > 0) {
      this.chars = comp.options.chars;
      delete this.options.chars;
    }
    if (comp.options.min != undefined && comp.options.min != null) {
      this.min = comp.options.min;
      delete this.options.min;
    }
    if (comp.options.max != undefined && comp.options.max != null) {
      this.max = comp.options.max;
      delete this.options.max;
    }
    if (comp.options.step != undefined && comp.options.step != null && comp.options.step > 0) {
      this.step = comp.options.step;
      delete this.options.step;
    }
    if (comp.options.showStep != undefined && comp.options.showStep != null) {
      if (comp.options.showStep == 'true') {
        this.showStep = true;
      } else {
        this.showStep = false;
      }
      delete this.options.showStep;
    }
    this.isResizable = true;

    if (comp.options.value != undefined && comp.options.value != null) {
      this.value = comp.options.value;
      delete this.options.value;
    }
    if (comp.options.numRadio != undefined && comp.options.numRadio != null && comp.options.numRadio > 0) {
      this.numRadio = comp.options.numRadio;
      for (let i = 0; i < this.numRadio; i++) {
        const c = new SRadioComponent();
        c.label = comp.options['radioComponentLabel_' + i];
        c.value = parseInt(comp.options['radioComponentValue_' + i]);
        c.isCorrect = false;
        if (comp.options['radioComponentIsCorrect_' + i] == 'true') {
          c.isCorrect = true;
        }
        delete this.options['radioComponentLabel_' + i];
        delete this.options['radioComponentValue_' + i];
        delete this.options['radioComponentIsCorrect_' + i];
        if (this.radioComponent == undefined || this.radioComponent == null) {
          this.radioComponent = new Array<SRadioComponent>();
        }
        this.radioComponent.push(c);
      }
      this.isResizable = false;
    }

    if (comp.options.numTableRowLabel && comp.options.numTableColLabel) {
      const numTableRowLabel = comp.options.numTableRowLabel;
      const numTableColLabel = comp.options.numTableColLabel;

      this.tableComponent = [];
      this.tableComponent[0] = new Array<STableComponent>();
      this.tableComponent[1] = new Array<STableComponent>();

      // copio label row
      for (let i = 0; i < numTableRowLabel; i++) {
        const c = new STableComponent();
        c.label = comp.options['tableComponentRowLabel_' + i];
        c.limit = comp.options['tableComponentRowLimit_' + i];
        this.tableComponent[0].push(c);
      }

      // copio label Col
      for (let i = 0; i < numTableColLabel; i++) {
        const c = new STableComponent();
        c.label = comp.options['tableComponentColLabel_' + i];
        c.limit = comp.options['tableComponentColLimit_' + i];
        this.tableComponent[1].push(c);
      }

      this.checkedString = comp.options.checkedString;
    }

    if (comp.options.tableComponent) {
      this.tableComponent = [...comp.options.tableComponent];
      delete this.options['tableComponent'];
    }


    if (this.componentType == SCompType.CHECKBOX) {
      this.dimHeight = 15;
      this.dimWidth = 15;
      this.isResizable = false;
    }

    // console.log(comp);

    if (comp.localUrl != undefined && comp.localUrl != null && comp.localUrl.trim() != '') {
      this.localUrl = comp.localUrl;
    }

    // });
  }

  convertPositionPercToAbs(sw: number, sh: number, step = null, type?) {

    const poss = this.pos.split(',');
    let x: number;
    x = parseFloat(poss[0]);
    let y: number;
    y = parseFloat(poss[1]);
    this.posX = (sw / 100) * x;
    this.posY = (sh / 100) * y;
    if (!!step && type !== 'CUSTOM_CLICK_AREA') {
      this.posX = this.calcPosition(this.posX, step);
      this.posY = this.calcPosition(this.posY, step);
    }
    if (!!step) {
      this.posX = this.calcPosition(this.posX, step);
      this.posY = this.calcPosition(this.posY, step);
    }
    this.pos = this.posX + ',' + this.posY;

  }

  calcPosition(x, step) {
    x = Math.round(x);
    const mx = x % step;
    if (mx >= (step / 2)) {
      x = x + (step - mx);
    } else {
      x = x - mx;
    }
    return x;
  }

  convertPositionAbsToPerc(sw: number, sh: number): string {
    const percX = this.posX * 100 / sw;
    const percY = this.posY * 100 / sh;

    return percX + ',' + percY;
  }

  convertDimensionPercToAbs(sw: number, sh: number) {
    const dims = this.dim.split(',');
    let w: number;
    w = parseInt(dims[0]);
    let h: number;
    h = parseInt(dims[1]);
    if (w != w) { // se è Nan
      this.dimWidth = null;
      this.dimHeight = null;
      this.percHeight = null;
      this.percWidth = null;
      this.dim = null + ',' + null;
    } else {
      this.dimWidth = sw / 100 * w;
      this.dimHeight = sh / 100 * h;
      this.percHeight = h;
      this.percWidth = w;
      this.dim = this.dimWidth + ',' + this.dimHeight;
    }
  }
}

export class SCompType {
  static BUTTON = 'BUTTON';
  static CLICK_AREA = 'CLICK_AREA';
  static IMAGE = 'IMAGE';
  static VIDEO = 'VIDEO';
  static VIDEO_RECORD = 'VIDEO_RECORD';
  static TEXT = 'TEXT';
  static CUSTOM_CLICK_AREA = 'CUSTOM_CLICK_AREA';
  static TEXTAREA = 'TEXTAREA';
  static RADIO = 'RADIO';
  static CHECKBOX = 'CHECKBOX';
  static TEXTBLOCK = 'TEXTBLOCK';
  static AUDIO = 'AUDIO';
  static TXTFILE = 'TXTFILE';
  static ELANFILE = 'ELANFILE';
  static RANGE = 'RANGE';
  static UPLOADS = 'UPLOADS';
  static CHECKABLETABLE = 'CHECKABLETABLE';
}

export class SComp {
  componentType: SCompType;
  id: string;
  mediaId: string;
  pos: string;
  dim: string;
  options: any;
  localUrl: string;
}

export class SlideType {
  static BLANK = 'BLANK';
  static INFO = 'INFO';
  static STIMULUS = 'STIMULUS';
  static DISTRACTION = 'DISTRACTION';
  static QUESTION = 'QUESTION';
  static ANSWER = 'ANSWER';
}

export class SSlide {
  name: string;
  type: SlideType;
  slideId: string;
  transitionType: Array<TransitionType>;
  slideContent: SlideComponent;
  options: any;
  toEdit: boolean;
}

export class SlideComponent {
  componentArray: Array<SComp>;
}

export class SRadioComponent {
  value: any;
  label: string;
  isCorrect: boolean;
}

export class STableComponent {
  label: string; // label riga o colonna da costruire
  limit: string; // limit riga o colonna da costruire
}

export class TestResult {
  date: any;
  testName: string;
  testId: string;
  piId: string; // identificativo del presentatore;
  partecipantId: string; // identificativo del partecipante;
  partecipantAge: number; // età del partecipante;
  questions: Array<QuestionResult>;
  userInfo: any;
  testStartTime: any;
  testEndTime: any;
}

export class QuestionResult {
  randomizationBlock: string;
  randomizationPresentationBlock: string;
  stimulusSlideId: string;
  stimulusSlideNumber: number;
  stimulusOrderInBlock: number;
  stimulusOrderInTest: number;
  directAnswer: any;
  expectedAnswer: any;
  stimulusStartTime: number;
  stimulusEndTime: number;
  delay: number;
  answerStartTime: number;
  answerEndTime: number;
  questionId: string;
  answerSlideId: string;
}

