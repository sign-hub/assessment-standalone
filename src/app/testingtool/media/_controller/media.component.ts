import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Photo } from '../_model/photo';
import { MdDialog, MdDialogRef } from '@angular/material';
import {DialogPreviewComponent} from './preview.component';
import { UploadMediaComponent } from './uploadMedia.component';
import { MediaService } from '../_services/media.service';
import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { FilterMedia } from '../_model/filterObj';
import { DatePipe } from '@angular/common';
import { DelMediaComponent } from './delMedia.component';

@Component({
  selector: 'app-media',
  templateUrl: '../_views/media.component.html',
  styleUrls: ['../_views/media.component.scss', '../../../share/e-home.scss']
})
export class MediaComponent extends BaseComponent implements OnInit {
  heightMedia: string;
  picker: any;
  photos: Array<Photo>;
  selectedImage: string;
  tabIndex: number;
  isLoading: boolean;
  filter: FilterMedia;
  pickerVideo: any;
  dateFormater: DatePipe;
  listView = false;
  gridView = true;

  constructor(public dialog: MdDialog,
    private mediaService: MediaService,
    protected router: Router,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    this.heightMedia = (this.height - 100) + 'px';
    this.dateFormater = new DatePipe('en-US');
  }

  ngOnInit() {
    this.filter = new FilterMedia();
    this.loadMedia('VIDEO');
  }

  loadMedia(type: string) {
    this.isLoading = true;
    this.mediaService.getMedia(type).subscribe(res => {
      if (res.status == 'OK') {
        this.photos = res.response;
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.isLoading = false;
    });
  }

  deleteMedia(m) {

  }

  doFilter() {
    this.isLoading = true;
    this.photos = [];
    const mDate: string = this.dateFormater.transform(this.filter.mediaDate, 'dd/MM/yyyy');
    this.mediaService.filterMedia(this.getTabIndex(this.tabIndex), this.filter.mediaName,
      this.filter.mediaAuthor, mDate).subscribe(res => {
        if (res.status == 'OK') {
          this.photos = res.response;
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
        }
        this.isLoading = false;
      });
  }

  changeTab(index) {
    this.tabIndex = index;
    this.loadMedia(this.getTabIndex(index));
  }

  getTabIndex(index) {
    let tab: string = null;
    switch (index) {
      case 0:
        tab = 'VIDEO';
        break;
      case 1:
        tab = 'PHOTO';
        break;
      case 2:
        tab = 'AUDIO';
        //break;
      case 3:
        tab = 'TEXT';
        break;
      default:
        tab = null;
    }
    return tab;
  }

  openPreview(urlImage) {
    this.dialog.open(DialogPreviewComponent, {data: urlImage});
  }

  openUpload() {
    const dialogRef = this.dialog.open(UploadMediaComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'OK') {
        this.changeTab(this.tabIndex);
      }
    });
  }

  delMedia(p) {
    const dialogRef = this.dialog.open(DelMediaComponent, {data: p});
     dialogRef.afterClosed().subscribe(res => {
      if (res == 'OK') {
        console.log('asdfsdf');
        this.changeTab(this.tabIndex);
      }
    });
  }

  setListView(){
    console.log('asdfsd');
    this.listView = true;
    this.gridView = false;
  }

  setGridView(){
    this.listView = false;
    this.gridView = true;
  }

}
