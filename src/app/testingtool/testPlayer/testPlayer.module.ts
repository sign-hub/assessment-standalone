import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { TestPlayerComponent } from './_controller/testPlayer.component';
import { UserInfoComponent } from './_controller/userInfo.component';

import { TestPlayerRouting } from './testPlayer.routing';
import { MediaService } from '../media/_services/media.service';
import { TestPlayerService } from './_services/testPlayer.service';
import { ResizableModule } from 'angular-resizable-element';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { WebcamDialogComponent } from './_controller/webcamDialog.component';

@NgModule({
  imports: [
    TestPlayerRouting,
    SharedModule,
    ResizableModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [TestPlayerComponent, UserInfoComponent, WebcamDialogComponent
  ],
  exports: [],
  providers: [MediaService,
    TestPlayerService],
  entryComponents: [UserInfoComponent, WebcamDialogComponent]
})
export class TestPlayerModule {
}
