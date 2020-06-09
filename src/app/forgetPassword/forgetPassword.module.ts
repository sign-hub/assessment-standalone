import { NgModule } from '@angular/core';
import { ForgetPasswordComponent } from './_controller/forgetPassword.component';
import { ForgetPasswordRouting } from './forgetPassword.routing';
import { SharedModule } from '../share/shared.module';
import { ForgetService } from './_services/forget.service';


@NgModule({
  imports: [
    ForgetPasswordRouting,
    SharedModule
  ],
  declarations: [ForgetPasswordComponent],
  exports: [],
  providers: [ForgetService]
})
export class ForgetPasswordModule {
}
