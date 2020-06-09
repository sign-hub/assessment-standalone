import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'status'})
export class StatusPippe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Not Active' : 'Active';
  }

}
