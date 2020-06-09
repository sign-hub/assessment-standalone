import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TestPlayerComponent} from './_controller/testPlayer.component';

const routes: Routes = [
  {path: '', component: TestPlayerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestPlayerRouting {
}
