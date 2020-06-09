import { Component, OnInit, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MediaService } from '../_services/media.service';

@Component({
  selector: 'app-dialog-del-media',
  templateUrl: '../_views/delMedia.component.html',
  styleUrls: ['../_views/delMedia.component.scss']
})
export class DelMediaComponent extends BaseComponent implements OnInit {
  uploader: FileUploader;
  buttonSubmitState: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              public mediaService: MediaService,
              public dialogRef: MdDialogRef<DelMediaComponent>,
              @Inject(MD_DIALOG_DATA) public data: any
              ) {
    super(router, mdSnackBar);

  }

  ngOnInit() {
  }

  deleteMedia(){
    this.mediaService.deleteMedia(this.data.mediaId).subscribe(res => {
       if (res.status == 'OK') {
        this.openSnackBar('Deleted media successful!');
        this.dialogRef.close('OK');
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
    });
  }
}