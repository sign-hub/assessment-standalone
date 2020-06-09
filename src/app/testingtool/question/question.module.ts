import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { QuestionComponent } from './_controller/question.component';
import { QuestionRouting } from './question.routing';
import { MediaService } from '../media/_services/media.service';
import { QuestionService } from './_services/question.service';
import { DragDropService, DragDropConfig, DragDropSortableService } from 'ng2-dnd';
import {ResizableModule} from 'angular-resizable-element';
import { InputFieldComponent } from './_controller/inputField.component';
import { RangeComponent } from './_controller/range.component';
import {TextAreaComponent} from './_controller/textArea.component';
import {TextBlockComponent} from './_controller/textblock.component';
import {ConfigSlideComponent} from './_controller/configSlide.component';
import {CheckboxComponent} from './_controller/checkbox.component';
import {RadioComponent} from './_controller/radio.component';
import {ClickareaComponent} from './_controller/clickarea.component';
import {ImageComponent} from './_controller/image.component';
import {ButtonComponent} from './_controller/button.component';
import {DeleteSlideComponent} from './_controller/delSlide.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {ImportSlideComponent} from './_controller/importSlide.component';
import {VideoComponent} from './_controller/video.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';


@NgModule({
  imports: [
    QuestionRouting,
    SharedModule,
    ResizableModule,
    ColorPickerModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [QuestionComponent,
    InputFieldComponent,
    TextAreaComponent,
    ConfigSlideComponent,
    CheckboxComponent,
    RadioComponent,
    ClickareaComponent,
    TextBlockComponent,
    ButtonComponent,
    RangeComponent,
    ImageComponent,
    DeleteSlideComponent,
    ImportSlideComponent,
    VideoComponent
  ],
  exports: [],
  providers: [MediaService,
    QuestionService,
    DragDropService,
    DragDropConfig,
    DragDropSortableService],
  entryComponents: [InputFieldComponent,
    TextAreaComponent, ConfigSlideComponent, CheckboxComponent, RangeComponent, DeleteSlideComponent, ImportSlideComponent,
    RadioComponent, ClickareaComponent, TextBlockComponent, ButtonComponent, ImageComponent , VideoComponent]
})
export class QuestionModule {
}
