import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestingToolComponent } from './_controller/testingtool.component';

export const TestingToolRouting: Routes = [
  { path: '', component: TestingToolComponent,
  children: [
    {
      path: '',
      redirectTo: 'testdownload',
      pathMatch: 'full'
    },
    {
      path: 'report',
      loadChildren: 'app/testingtool/report/report.module#ReportModule'
    },
    {
      path: 'testlist',
      loadChildren: 'app/testingtool/testlist/testlist.module#TestListModule'
    },
    {
      path: 'testdownload',
      loadChildren: 'app/testingtool/testdownload/testdownload.module#TestDownloadModule'
    },
    {
      path: 'media',
      loadChildren: 'app/testingtool/media/media.module#MediaModule'
    },
    {
      path: 'testedit',
      loadChildren: 'app/testingtool/testedit/testEdit.module#TestEditModule'
    },
    {
      path: 'testplayer',
      loadChildren: 'app/testingtool/testPlayer/testPlayer.module#TestPlayerModule'
    },
    {
      path: 'question',
      loadChildren: 'app/testingtool/question/question.module#QuestionModule'
    },
  ] }
];
