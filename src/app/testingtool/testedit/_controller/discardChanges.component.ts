import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {TestEditService} from '../_services/testEdit.service';

@Component({
  templateUrl: '../_views/discardChanges.html',
  styleUrls: ['../_views/discardChanges.scss']
})
export class DiscardChangesComponent extends BaseComponent implements OnInit {
  isLoading: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              private testListService: TestEditService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DiscardChangesComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
  }

  deleteQuestion() {
    this.dialogRef.close('OK');
  }
}
