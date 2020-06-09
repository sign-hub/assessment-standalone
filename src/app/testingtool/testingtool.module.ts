import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import {TestingToolRouting} from './testingtool.routing';

import { TestingToolComponent } from './_controller/testingtool.component';

import { TestingToolService } from './services/testingTool.service';
import { ProfileSerivce } from '../profile/_service/profile.service';

/*import { MediaModule } from './media/media.module';
import { ReportModule } from './report/report.module';*/
import { TestListModule } from './testlist/testlist.module';
// ---------------------------
/*import { TestEditModule } from './testedit/testEdit.module';
import { TestPlayerModule } from './testPlayer/testPlayer.module';
import { QuestionModule } from './question/question.module';*/
// ---------------------------

import { SharedModule } from '../share/shared.module';
import {NgxElectronModule} from 'ngx-electron';



@NgModule({
  imports: [
    // TestingToolComponent,
    /*TestEditModule,
    TestPlayerModule,
    QuestionModule,

    ReportModule,*/
    // TestListModule,
    // MediaModule,
    CommonModule,
    SharedModule,
    RouterModule,
    NgxElectronModule,
    // TestingToolRouting
    /*RouterModule.forChild(routes)*/
  ],
  declarations: [
    TestingToolComponent
  ],
  providers : [TestingToolService, ProfileSerivce],
})

export class TestingToolModule { }
