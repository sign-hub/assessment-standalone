import { NgModule } from '@angular/core';
import { RecoveryPasswordComponent } from './_controller/recoverypassword.component';
import { RecoveryPasswordRouting } from './recoverypassword.routing';
import { SharedModule } from '../share/shared.module';
import { RecoveryService } from './_services/recovery.service';

@NgModule({
  imports: [
    RecoveryPasswordRouting,
    SharedModule
  ],
  declarations: [RecoveryPasswordComponent],
  exports: [],
  providers: [RecoveryService]
})
export class RecoveryPasswordModule {
}
