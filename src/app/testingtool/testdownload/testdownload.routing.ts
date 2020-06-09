import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestDownloadComponent } from './_controller/testdownload.component';

const routes: Routes = [
  { path: '', component: TestDownloadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestDownloadRouting { }