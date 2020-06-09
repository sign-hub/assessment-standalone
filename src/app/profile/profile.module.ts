import { NgModule } from '@angular/core';

import { ProfileComponent } from './_controller/profile.component';
import { ProfileRouting } from './profile.routing';
import { SharedModule } from '../share/shared.module';
import { ProfileSerivce } from './_service/profile.service';

@NgModule({
  imports: [
    ProfileRouting,
    SharedModule
  ],
  declarations: [ProfileComponent],
  exports: [],
  providers: [ProfileSerivce]
})
export class ProfileModule {
}
