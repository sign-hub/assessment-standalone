import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { TestListService } from '../_service/testlist.service';
import { NavigationExtras, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { TestSmall } from '../_model/testSmall';
import { TestEventService } from '../../services/testEvent.service';
import { DeleteTestComponent } from './delTest.component';
import { ElectronService } from 'ngx-electron';
import { Response } from '@angular/http';


declare var require: any;

@Component({
  selector: 'app-testdownload',
  templateUrl: '../_views/testdownload.component.html',
  styleUrls: ['../_views/testdownload.component.scss', '../../../share/e-home.scss']
})

export class TestDownloadComponent extends BaseComponent implements OnInit {
  photo: any;
  video: any;
  data: any = [];
  loading: boolean;
  isEdit: boolean;
  isRemove: boolean;
  test: TestSmall;
  isLoading: boolean;
  metiaTypes = ['VIDEO', 'IMAGE', 'EAN', 'TEXT'];
  downloadUrl: string;
  checkedIndex: string;
  fs: any;
  base64: any;
  allMedias: any;
  filter_name: string;
  allTests: Array<TestSmall>;
  mediaArray: Array<string> = [];
  mediaNumber: number = 0;
  constructor(private testListService: TestListService,
    protected router: Router,
    public mdSnackBar: MdSnackBar,
    public dialog: MdDialog,
    public _electronService: ElectronService,
    public zone: NgZone,
    public elemRef: ElementRef,
    public testEventService: TestEventService) {
    super(router, mdSnackBar, _electronService);
    this.testEventService.fireEvent.subscribe(res => {
      if (res == 'OK') {
        this.init();
      }
    });

    const remote = this._electronService.remote;

    if (!!remote) {
      this.fs = remote.getGlobal('fs');
      this.base64 = this._electronService.remote.getGlobal('base64');
    }


  }

  ngOnInit() {
    this.loading = false;
    this.isEdit = false;
    this.isRemove = false;
    this.init();
  }

  init() {
    this.loading = true;
    this.data = [];
    this.testListService.getTestList().subscribe(res => {
      if (res.status == 'OK') {
        this.getMedias();
        this.data = res.response;
        this.data = this.data.filter(function (e) {
          return !e.deleted;
        });

        if (this.data.length > 0) {
          this.data[0].checked = true;
          this.chooseTest(this.data[0], 0);
        }
        this.allTests = this.data;
        this.data.forEach((test, index) => {
          this.dbTests.findOne({ TestId: test.TestId }, (err, doc) => {
            if (!!doc) {
              this.zone.run(() => {
                this.data[index] = Object.assign({ is_downloaded: 1 }, this.data[index]);
                this.allTests[index] = Object.assign({ is_downloaded: 1 }, this.allTests[index]);
              });
            }
          });
        });
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });
  }

  getMedias() {

    this.testListService.getMedias().subscribe(res => {
      if (res.status == 'OK') {
        this.allMedias = res.response;
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });

  }

  getReports() {

    this.testListService.getReportList().subscribe(res => {
      if (res.status == 'OK') {
        this.dbReports.remove({}, { multi: true }, (err, numRemoved) => {
          res.response.forEach((element) => {
            this.dbReports.insert(element);
          });
        });
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });

  }

  editTest() {
    if (this.test) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.test.TestId
        }
      };
      this.router.navigate(['/testedit'], navigationExtras);
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  private unSelectedAll(id) {
    if (this.data && this.data.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].TestId != id) {
          this.data[i].checked = false;
        }
      }
    }
  }

  chooseTest(test, index) {
    this.unSelectedAll(test.TestId);
    if (test.checked) {
      this.test = test;
      this.checkedIndex = index;
      const userId: string = localStorage.getItem('userId');
      this.isRemove = userId == test.authorId ? true : false;
      this.isEdit = test.toEdit;
    } else {
      this.test = null;
    }
  }

  deleteTest(e, i) {
    if (!!e) {
      const d = this.dialog.open(DeleteTestComponent, { disableClose: true, data: e });
      d.afterClosed().subscribe(res => {
        if (res == 'OK') {
          this.data[i].is_downloaded = 0;
          this.allTests[i] = Object.assign({ is_downloaded: 1 }, this.allTests[i]);
        }
      });
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  cloneTest() {

    if (this.test) {
      this.isLoading = true;
      this.testListService.cloneTest(this.test.TestId).subscribe(res => {
        if (res.status == 'OK') {
          this.openSnackBar('Clone test successful!');
          this.init();
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
        }
        this.isLoading = false;
      });
    } else {
      this.openSnackBar('Please choose a test!');
    }

  }

  downloadTest() {
    if (this.test) {
      this.zone.run(() => {
        this.loading = true;
        this.testListService.requetGetTest(this.test.TestId).subscribe(res => {
          if (res.status == 'OK') {
            this.openSnackBar('Downloaded test successful!');

            this.dbTests.findOne({ TestId: this.test.TestId }, (err, doc) => {
              if (!doc) {
                this.dbTests.insert(res.response,  (err: any, newDocs) => {
                  this.data[this.checkedIndex] = Object.assign({ is_downloaded: 1 }, this.data[this.checkedIndex]);
                  this.allTests[this.checkedIndex] = Object.assign({ is_downloaded: 1 }, this.allTests[this.checkedIndex]);
                  this.openSnackBar('Test downloaded successfully. Media downloading in the background');
                  this.loading = false;
                   this.downloadMedia(newDocs).then((r) => {
                  }).catch((er) => {
                    this.openSnackBar(er.message);
                    this.loading = false;
                  });
                });
              } else {
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
            this.processStatusError(res.errors);
            console.error('Server error');
          }
        });
      });
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  downloadMedia(test) {
    const promise = new Promise((resolve, reject) => {

      if (!test) {
        reject({ message: 'There was an error with the Media Download' });
      }


      test.questions.forEach( (element) => {


        if (element.slides.length > 0) {

           element.slides.forEach(  (slide) => {
             slide.slideContent.componentArray.forEach(  (component) => {
              if (this.metiaTypes.indexOf(component.componentType) != -1) {

                this.dbMedias.findOne({ mediaId: component.mediaId },  (err, doc) => {
                  if (!doc) {
                    this.mediaNumber++;
                    let time = 2000;
                    console.log(component.componentType, component.mediaId);
                    this.getMedia(component.mediaId, component.componentType, test.TestId).then((r) => {
                      this.mediaArray.push(component.mediaId);
                      this.checkMedias(time);
                    }).catch((er) => {
                      this.openSnackBar(er);
                    })
                  }
                });

              }
            });
          });
           resolve(test);
        }
      });
    });

    return promise;
  }

  checkMedias(time) {
    setTimeout(() => {
      if (this.mediaArray.length == this.mediaNumber){
        this.openSnackBar('Media downloaded successfully');
      } else {
        time += 1000;
        this.checkMedias(time);
      }
    }, time);
  }

  buildMediaPath(base, testId, mediaId, extension, toCreate) {
    const folderPath =  base + '/medias/' + testId;
    const filePath = '/' + mediaId + '.' + extension;
    if (toCreate) {
      if (!this.fs.existsSync(folderPath)) {
        this.fs.mkdirSync(folderPath);
      }
    }
    return folderPath + filePath;
  }

  getMediaAndType(mediaId, type, testId) {
    const promise = new Promise((resolve, reject) => {
      this.testListService.getMedia(mediaId).subscribe(response => {
        if (response.status == 'OK') {
          let media = [];
          media.push(response.response);
        if (type == 'PHOTO' || type == 'IMAGE') {
          if (!!this.fs) {
             this.testListService.requetGetImage('/media/retrieve?repositoryId=' + mediaId + '&thumb=false&base64=true')
             .subscribe(resp => {
                this.photo = resp._body;
              }, (err: any) => {
                reject('Media could not be downloaded please download again');
              },  () => {
              // const path =  this.base_path + '/medias/' + mediaId + '.jpg';
              const path = this.buildMediaPath(this.base_path, testId, mediaId, 'jpg', true);
               this.base64.decode(this.photo, path, (err) => {
                if (err) {
                  throw err;
                };
                resolve(true);
                const newMedia = Object.assign({ localUrl: path }, media[0]);
                if (!!newMedia) {
                  this.dbMedias.insert(newMedia, (err, newDocs) => { });
                }
              });
            });
          }
        } else if (type == 'VIDEO') {
          if (!!this.fs) {
             this.testListService.requetGetImage('/retrievePublic?code=' + media[0].publicUrl + '&base64=true').subscribe(response => {
              this.video = response._body;
            }, (err: any) => {
              reject('Media could not be downloaded please download again');
            },  () => {
              const path = this.buildMediaPath(this.base_path, testId, mediaId, 'mp4', true);
              // const path =  this.base_path + '/medias/' + media[0].mediaId + '.mp4';
                const dbMedias = this.dbMedias;
                this.base64.decode(this.video, path, function (err, output) {
                    if (err) {
                      throw err;
                    };
                    const newMedia = Object.assign({ localUrl: path }, media[0]);
                    if (!!newMedia) {
                      dbMedias.insert(newMedia, (err, newDocs) => { });
                    }
                });
            });
          }
        }
      }
      });
    });
    return promise;
  }

   getMedia(mediaId, type, testId) {
    if(type != undefined && type != null) {
      return this.getMediaAndType(mediaId, type, testId);
    }
    const promise = new Promise((resolve, reject) => {
      const media = this.allMedias.filter((element) => {
        return element.mediaId == mediaId;
      });

    console.log(media);
    if (!media[0]) {
      return;
    }

    if (media[0].mediaType == 'PHOTO') {
      if (!!this.fs) {
         this.testListService.requetGetImage('/media/retrieve?repositoryId=' + media[0].mediaId + '&thumb=false&base64=true')
         .subscribe(response => {
          this.photo = response._body;
        }, (err: any) => {
          reject('Media could not be downloaded please download again');
        },  () => {
          const path = this.buildMediaPath(this.base_path, testId, mediaId, 'jpg', true);
          // const path =  this.base_path + '/medias/' + media[0].mediaId + '.jpg';
           this.base64.decode(this.photo, path, (err) => {
            if (err) {throw err;};
            resolve(true);
            const newMedia = Object.assign({ localUrl: path }, media[0]);
            if (!!newMedia) {
              this.dbMedias.insert(newMedia, (err, newDocs) => { });
            }
          });
        });
      }

    } else if (media[0].mediaType == 'VIDEO') {
      if (!!this.fs) {
         this.testListService.requetGetImage('/retrievePublic?code=' + media[0].publicUrl + '&base64=true').subscribe(response => {
          this.video = response._body;
        }, (err: any) => {
          reject('Media could not be downloaded please download again');
        },  () => {
          const path = this.buildMediaPath(this.base_path, testId, mediaId, 'mp4', true);
          // const path =  this.base_path + '/medias/' + media[0].mediaId + '.mp4';
            const dbMedias = this.dbMedias;
            this.base64.decode(this.video, path, function (err, output) {
                if (err) {throw err; };
                const newMedia = Object.assign({ localUrl: path }, media[0]);
                if (!!newMedia) {
                  dbMedias.insert(newMedia, (err, newDocs) => { });
                }
            });
        });
      }
    }

  });

    // },200);
  return promise;

  }

  doFilter() {
    if (this.filter_name == undefined) {
      return;
    }
    this.data = this.allTests.filter((test) => {
      if (test.TestName.toLowerCase().indexOf(this.filter_name.toLowerCase()) != -1) {
        return true;
      } else {
        return false;
      }
    });
  }

  dldUrl() {
    this.testListService.requestDownloadFile('/retrievePublic?code=d63d0fd3-f3f4-422d-bdb8-ee2ceca51ea6').subscribe(response => {
      console.log(response);
    });
  }

  isDownloaded(testId) {
    this.dbTests.findOne({ TestId: testId }, (err, doc) => {
      return !!doc;
    });
  }


}
