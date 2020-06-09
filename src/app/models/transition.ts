import {TransitionType} from './question';

export class Transition {
  time: boolean;
  click: boolean;
  enter: boolean;
  action: boolean;
  second: number;

  constructor() {
    this.time = false;
    this.click = false;
    this.enter = false;
    this.action = false;
  }

  getTransitionType(field): TransitionType {
    if ( field == 'time') {
      return TransitionType.time;
    }
    if ( field == 'click') {
      return TransitionType.click;
    }
    if ( field == 'enter') {
      return TransitionType.enter;
    }
    if ( field == 'action') {
      return TransitionType.action;
    }
  }
}
