import {NgModule} from '@angular/core';

import {TestListComponent} from './_controller/testlist.component';
import {TestListRouting} from './testlist.routing';
import {SharedModule} from '../../share/shared.module';
import {TestListService} from './_service/testlist.service';
import {TestEventService} from '../services/testEvent.service';
import {DeleteTestComponent} from './_controller/delTest.component';

@NgModule({
  imports: [
    TestListRouting,
    SharedModule
  ],
  declarations: [TestListComponent, DeleteTestComponent],
  exports: [],
  providers: [TestListService, TestEventService],
  entryComponents: [DeleteTestComponent]
})
export class TestListModule {
}
