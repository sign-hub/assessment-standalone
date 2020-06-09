import {Directive, ElementRef, Input, Output, OnInit, AfterViewInit, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {BaseService} from '../base.service';

@Directive({
  selector: '[urlApiVideo]'
})
export class LoadVideoDirective extends BaseService implements OnInit, AfterViewInit {
  @Input('urlApiVideo') urlApiVideo: string;
  @Output() done: EventEmitter<string> = new EventEmitter<string>();

  constructor(private el: ElementRef,
              protected http: Http) {
    super(http);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.loadFileImage();
  }

  loadFileImage() {
    let url = '';
    if (this.urlApiVideo) {
      url = this.urlApiVideo;
    } else {
      url = '/assets/img/thumbnail.png';
    }
    this.requestGet(url.replace('/', '')).subscribe(res => {
      const url = this.url + 'retrievePublic?code=' + res.code;
      console.log(url);
      // const image = new Blob([res.arrayBuffer()], {type: 'image/png'});
      // const reader = new (<any>window).FileReader();
      // reader.readAsDataURL(image);
      // const myReader: FileReader = new FileReader();
      /*myReader.onloadend = (e) => {
        this.el.nativeElement.src = url;
      };
      myReader.readAsDataURL(image);*/
      this.el.nativeElement.src = url;
      this.done.emit('OK');
    });
  }
}
