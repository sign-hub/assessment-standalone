import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TestEditComponent} from './_controller/testEdit.component';
import { CanDeactivateGuard }    from '../../share/guards/can-deactivate-guard.service';

const routes: Routes = [
  {path: '', component: TestEditComponent, canDeactivate: [CanDeactivateGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestEditRouting {
}
