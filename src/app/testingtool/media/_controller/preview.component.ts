import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MediaComponent } from './media.component';
import { Photo } from '../_model/photo';
import {Baseconst} from '../../../share/base.constants';


@Component({
  selector: 'app-dialog-preview',
  templateUrl: '../_views/preview.component.html',
  styleUrls: ['../_views/preview.component.scss']
})
export class DialogPreviewComponent {
  image: Photo;
  url: string;
  isLoading: boolean;
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.image = data;
    this.isLoading = true;
    if (this.image.mediaType == 'VIDEO') {
      // this.url = Baseconst.protocol + '://' + Baseconst.url +'/retrievePublic?code=' + this.image.publicUrl;
      this.url = Baseconst.getPartialBaseUrl() + '/retrievePublic?code=' + this.image.publicUrl;
      this.isLoading = false;
    }
  }

  doneLoading(e) {
    console.log(e);
    this.isLoading = false;
  }
}
