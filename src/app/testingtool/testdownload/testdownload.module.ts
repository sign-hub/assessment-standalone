import {NgModule} from '@angular/core';

import {TestDownloadComponent} from './_controller/testdownload.component';
import {TestDownloadRouting} from './testdownload.routing';
import {SharedModule} from '../../share/shared.module';
import {TestListService} from './_service/testlist.service';
import {TestEventService} from '../services/testEvent.service';
import {DeleteTestComponent} from './_controller/delTest.component';
import {NgxElectronModule} from 'ngx-electron';

@NgModule({
  imports: [
    TestDownloadRouting,
    SharedModule,
    NgxElectronModule
  ],
  declarations: [TestDownloadComponent, DeleteTestComponent],
  exports: [],
  providers: [TestListService, TestEventService],
  entryComponents: [DeleteTestComponent]
})
export class TestDownloadModule {

}
