import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryPasswordComponent } from './_controller/recoverypassword.component';

const routes: Routes = [
  { path: '', component: RecoveryPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoveryPasswordRouting {
}
