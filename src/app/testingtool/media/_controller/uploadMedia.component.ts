import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MediaComponent } from './media.component';
import { Photo } from '../_model/photo';
import { FileSelectDirective, FileUploader, FileItem } from 'ng2-file-upload';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dialog-upload',
  templateUrl: '../_views/uploadMedia.component.html',
  styleUrls: ['../_views/uploadMedia.component.scss', '../../../share/base.scss']
})
export class UploadMediaComponent extends BaseComponent implements OnInit {
  uploader: FileUploader;
  buttonSubmitState: boolean;
  files: any;
  fileList: FileList;
  numFiles: any;
  isUploading: boolean;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<UploadMediaComponent>, public http: Http) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
    this.initUploader();
  }

  initUploader() {
    const token: string = localStorage.getItem('token');
    this.uploader = new FileUploader({
      url: Baseconst.getCompleteBaseUrl() + 'testingtool/media'
    });
    this.uploader.setOptions({ headers: [{ name: 'authtoken', value: token }] });
    this.uploader.onAfterAddingFile = (item: FileItem) => {
      console.log(item);
      // if (item.file.size > 3145728 ||
      //   (item.file.type != 'image/jpeg' && item.file.type != 'image/png' && item.file.type != 'image/jpg')) {
      //   this.uploader.removeFromQueue(item);
      //   this.openSnackBar('File upload not format file!');
      // }
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.uploader.removeFromQueue(item);
      if (this.uploader.queue.length <= 0) {
        this.openSnackBar('Upload media successful!');
        this.dialogRef.close('OK');
      }
    };
  }

  fileChange(event) {
    this.fileList = event.target.files;

  }

  uploadAll() {
    this.numFiles = this.fileList.length;
    if (this.fileList.length > 0) {
      const headers = new Headers();
      /** No need to include Content-Type in Angular 4 */
      const token: string = localStorage.getItem('token');
      /*headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');*/
      headers.append('authtoken', token);
      const url = Baseconst.getCompleteBaseUrl() + 'testingtool/media';
      const options = new RequestOptions({ headers: headers });
      this.isUploading = true;
      for (let i = 0; i < this.fileList.length; i++) {
        const file: File = this.fileList[i];
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.http.post(url, formData, options)
          .map(res => res.json())
          .catch(error => Observable.throw(error))
          .subscribe(
            data => {
              console.log('success');
              this.fileTransferred();
            },
            error => {
              console.log(error);
              this.openSnackBar('Upload media error');
              this.dialogRef.close('OK');
            }
          );
      }
    }
  }

  fileTransferred() {
    if (this.numFiles > 0) {
      this.numFiles = this.numFiles - 1;
    }
    if (this.numFiles <= 0) {
      this.isUploading = false;
      this.openSnackBar('Upload media successful!');
      this.dialogRef.close('OK');
    }
  }
}
