import {Directive, ElementRef, Input, Output, OnInit, AfterViewInit, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {BaseService} from '../base.service';

@Directive({
  selector: '[urlApi]'
})
export class LoadImageDirective extends BaseService implements OnInit, AfterViewInit {
  @Input('urlApi') urlApi: string;
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
    if (this.urlApi) {
      url = this.urlApi;
    } else {
      url = '/assets/img/thumbnail.png';
    }
    this.requestDownloadFile(url.replace('/', '')).subscribe(res => {
      const image = new Blob([res.arrayBuffer()], {type: 'image/png'});
      const reader = new (<any>window).FileReader();
      reader.readAsDataURL(image);
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.el.nativeElement.src = myReader.result;
      };
      myReader.readAsDataURL(image);
      this.done.emit('OK');
    });
  }
}
