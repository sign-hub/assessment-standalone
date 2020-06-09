import { Component, AfterViewInit, ViewChild, NgZone, Inject } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBarConfig, MdSnackBar } from '@angular/material';
import { Baseconst } from 'app/share/base.constants';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'app-webcam-dialog',
  templateUrl: '../_views/webcamDialog.component.html',
  styleUrls: ['../_views/webcamDialog.component.scss', '../../../share/base.scss']
})
export class WebcamDialogComponent implements AfterViewInit {

  private stream: MediaStream;
  private recordRTC: any;
  public isRecording: boolean;
  public isStopped: boolean;
  public videoBoolean: boolean;
  public blob: Blob
  public isLoading = false;
  public mediaTestId: string;
  public result: any;
  fs: any;
  blobDataUrl: any;



  @ViewChild('video') video;
  @ViewChild('videoPlayer') videoPlayer;

  constructor(private zone: NgZone,
    private thisDialogRef: MdDialogRef<WebcamDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    private snackBar: MdSnackBar,
    public _electronService: ElectronService) {
    this.mediaTestId = this.data['mediaTestId'];
    // Do stuff
    if (!!this._electronService && this._electronService.remote) {
      this.fs = this._electronService.remote.getGlobal('fs');
    }
  }

  ngAfterViewInit() {
    // set the initial state of the video
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = false;
    video.autoplay = false;
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      bitsPerSecond: 2080000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
    video.srcObject = stream;
    this.toggleControls();
  }

  errorCallback() {
    console.log(this);
  }

  processVideo(audioVideoWebMURL) {
    this.videoBoolean = true;
    const recordRTC = this.recordRTC;
    setTimeout(() => {
      this.videoPlayer.nativeElement.src = audioVideoWebMURL;
    }, 100);
    this.toggleControls();
    this.blob = recordRTC.getBlob();
    const recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL((dataURL) => {
      this.blobDataUrl = dataURL;
    });
  }

  startRecording() {
    let mediaConstraints = {
      video: true,
      audio: true
    };
    this.isRecording = true;
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    this.isStopped = true;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }

  download() {
    this.recordRTC.save('video.webm');
  }

  uploadNew() {
    console.log('WEBCAMDIALOG uploadNew');
    if (this.blob) {
      const fileName = `${Date.now()}${Math.random() * 1000}.webm`;
      console.log('WEBCAMDIALOG filename ' + fileName);
      this.isLoading = true;
      const base_path = this._electronService.remote.app.getAppPath();
      const folderPath = base_path + '/temps/' + this.mediaTestId;
      console.log('WEBCAMDIALOG folderPath ' + folderPath);
      if (!this.fs.existsSync(folderPath)) {
        this.fs.mkdirSync(folderPath);
      }
      console.log('WEBCAMDIALOG writing ' + folderPath + '/' + fileName);
      let reader = new FileReader();

      reader.addEventListener('loadend', () => {
        let buffer = Buffer.from(reader.result);
        this.fs.writeFile(folderPath + '/' + fileName,
          buffer, 'binary', () => {
            console.log('WEBCAMDIALOG opening message ');
            this.openSnackBar('Video saved');
            this.isLoading = false;
            console.log('WEBCAMDIALOG closing...');
            console.log(this.thisDialogRef);
            this.thisDialogRef.close({
              name: fileName,
              stream: this.stream
            });
          });
        //this.fs.writeFileSync(folderPath + '/' + fileName, this.blobDataUrl);
      });
      reader.readAsArrayBuffer(this.blob);
    }
  }

  upload() {
    if (this.blob) {
      let fileName = `${Date.now()}${Math.random() * 1000}.webm`;
      this.isLoading = true;
      const headers = new Headers();
      /** No need to include Content-Type in Angular 4 */
      const token: string = localStorage.getItem('token');
      /*headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');*/
      headers.append('authtoken', token);
      const url = Baseconst.getCompleteBaseUrl() + 'testingtool/media';
      const options = new RequestOptions({ headers: headers });
      const formData: FormData = new FormData();
      formData.append(`file`, this.blob, fileName);
      formData.append(`mediaTestId`, this.mediaTestId);
      this.http.post(url, formData, options)
        .subscribe(
          data => {
            console.log('success');
            this.result = data;
          },
          error => {
            console.log(error);

          },
          () => {
            this.openSnackBar('Video uploaded');
            this.isLoading = false;
            this.thisDialogRef.close({
              name: fileName,
              response: this.result._body,
              stream: this.stream
            });

          }
        );
    }
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }

}
