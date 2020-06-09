import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {QuestionComponent} from './_controller/question.component';

const routes: Routes = [
  {path: '', component: QuestionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRouting {
}
