import {Subject} from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class TestEventService {
  public fireEvent: Subject<any> = new Subject();

  public notify(something: any) {
    this.fireEvent.next(something);
  }
}
