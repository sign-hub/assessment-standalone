import { NgModule } from '@angular/core';
import { LoginComponent } from './_controller/login.component';
import { LoginRouting } from './login.routing';
import { SharedModule } from '../share/shared.module';
import { AuthenService } from './_service/authen.service';

@NgModule({
  imports: [
    LoginRouting,
    SharedModule
  ],
  declarations: [LoginComponent],
  exports: [],
  providers: [AuthenService]
})
export class LoginModule {
}
