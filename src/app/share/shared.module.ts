import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/*import {FlexLayoutModule} from '@angular/flex-layout';*/
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslationModule} from '../translation.module';
import {LoadImageDirective, LoadVideoDirective, PasswordConfirm} from './directives';
import {FileUploadModule, FileSelectDirective} from 'ng2-file-upload';
import {RolePipe} from './pipe/role.pipe';
import {StatusPippe} from './pipe/status.pipe';
import {DndModule} from 'ng2-dnd';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
} from '@angular/material';

@NgModule({
  declarations: [LoadImageDirective,
    LoadVideoDirective,
    RolePipe,
    StatusPippe,
    PasswordConfirm],
  imports: [
    /*FlexLayoutModule,*/
    TranslationModule,
    FileUploadModule,
    DndModule],
  exports: [ MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    /*FlexLayoutModule,*/
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdNativeDateModule,
    TranslationModule,
    LoadImageDirective,
    LoadVideoDirective,
    FileSelectDirective,
    RolePipe,
    StatusPippe,
    PasswordConfirm,
    DndModule
  ],
  providers: []
})
export class SharedModule {
}
