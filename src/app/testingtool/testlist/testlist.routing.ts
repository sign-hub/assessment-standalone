import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestListComponent } from './_controller/testlist.component';

const routes: Routes = [
  { path: '', component: TestListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestListRouting { }
