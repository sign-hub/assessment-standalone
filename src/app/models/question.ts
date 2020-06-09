import {SSlide} from './component';

export class TransitionType {
  static time = 'time';
  static click = 'click';
  static enter = 'enter';
  static action = 'action';
}

export  class Question {
  questionId: string;
  name: string;
  slides: Array<SSlide>;
  transitionType: Array<TransitionType>;
  options: any;
  toEdit: boolean;
  questionIndexGroup: number;
  groupIndex: number;
  groupName: any;
}
