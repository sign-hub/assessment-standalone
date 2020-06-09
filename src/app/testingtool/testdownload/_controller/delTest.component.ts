import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {TestListService} from '../_service/testlist.service';
import {ElectronService} from 'ngx-electron';
import { cpus } from 'os';

@Component({
  selector: 'app-dialog-del-test',
  templateUrl: '../_views/delTest.component.html',
  styleUrls: ['../_views/delTest.component.scss']
})
export class DeleteTestComponent extends BaseComponent implements OnInit {
  fs: any;
  isLoading: boolean;
  mediaArray: Array<string> = [];
  allMediaArray: Array<string> = [];

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              private testListService: TestListService,
              public _electronService: ElectronService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DeleteTestComponent>) {
    super(router, mdSnackBar, _electronService);

    const remote = this._electronService.remote;

    if (!!remote) {
      this.fs = this._electronService.remote.getGlobal('fs');
    }
  }

  ngOnInit() {
  }

  async deleteTest() {
    this.isLoading = true;
    const mediaArray = this.mediaArray;
    const allMediaArray = this.allMediaArray;

    await this.dbTests.find({ TestId: this.data.TestId }, function (err, docs) {
      if (!!docs){
        docs.map((doc: any) => {
          const questions = doc.questions;
          questions.map((question: any) => {
            const slides = question.slides;
            slides.map((slide: any) => {
              const components = slide.slideContent.componentArray;
              components.map((component: any) => {
                if (component.componentType == 'IMAGE'){
                  if (mediaArray.indexOf(component.mediaId) === -1){
                    mediaArray.push(component.mediaId + '.jpg');
                  }
                } else if (component.componentType == 'VIDEO'){
                  if (mediaArray.indexOf(component.mediaId) === -1){
                    mediaArray.push(component.mediaId + '.mp4');
                  }
                }
              });
            });
          });
        });
      }
    });
    await this.dbTests.find({ TestId: { $nin: [ this.data.TestId ] } }, function (err, docs) {
      if (!!docs){
        docs.map((doc: any) => {
          const questions = doc.questions;
          questions.map((question: any) => {
            const slides = question.slides;
            slides.map((slide: any) => {
              const components = slide.slideContent.componentArray;
              components.map((component: any) => {
                if (component.componentType == 'IMAGE'){
                  if (allMediaArray.indexOf(component.mediaId) == -1){
                    allMediaArray.push(component.mediaId + '.jpg');
                  }
                } else if (component.componentType == 'VIDEO'){
                  if (allMediaArray.indexOf(component.mediaId) == -1){
                    allMediaArray.push(component.mediaId + '.mp4');
                  }
                }
              });
            });
          });
        });
      }
    });
    await this.dbTests.remove({ TestId: this.data.TestId }, { multi: true },  (err, numRemoved) => {
      mediaArray.map((media: any) => {
        if (!allMediaArray.includes(media)){
          const deleteMedia = media.substring(0, media.length - 4);
          const deleteFile = media;
          this.dbMedias.remove({ mediaId: deleteMedia }, (err, mediaNum) => {
            console.log(mediaNum);
            this.fs.unlinkSync(this.base_path + '/medias/' + deleteFile);
          });
        }
      });
      this.dialogRef.close('OK');
      this.openSnackBar('Deleted test successful!');
      this.isLoading = false;
    });

  }
}
