
import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../../share/base.component';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'app-textarea',
  templateUrl: '../_views/textblock.component.html',
  styleUrls: ['../_views/textblock.component.scss', '../../../share/e-home.scss']
})
export class TextBlockComponent extends BaseComponent implements OnInit {
   input: any;
  //color: any;
  ckeditorContent: string;
  froalaoptions: any;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              public dialogRef: MdDialogRef<TextBlockComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
    this.ckeditorContent = '';
  }

  ngOnInit(): void {
    console.log('init');
    //this.color = this.input.options.color;
    jQuery.FroalaEditor.DefineIcon('smallcaps', {NAME: 'text-width'});
    jQuery.FroalaEditor.RegisterCommand('smallcaps', {
      title: 'Small-caps',
      focus: true,
      undo: false,
      refreshAfterCallback: true,
      showOnMobile: true,

      // Called when the button is hit.
      callback: function () {
        console.log('-------callback------');
        console.log (this);
        // The current context is the editor instance.
        console.log (this.html.get());
        this.paragraphFormat.apply('H2');
        console.log('-------------');

      },

      // Called when the button state might have changed.
      refresh: function ($btn) {
        console.log('-------refresh------');
        console.log($btn);
        // The current context is the editor instance.
        console.log (this.selection.element());
        console.log('-------------');
        const blocks = this.selection.blocks();
        const blk = null;
        if (blocks.length) {
          const blk = blocks[0];
        }

        $btn.toggleClass('fr-active', blk && blk.tagName == 'H2');
      }
    });
    /*this.froalaoptions = {
      charCounterCount: false,
      toolbarButtons: ['bold', 'italic', 'underline']
  };*/
  /*'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript',
  'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle',
  'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL',
  'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo',
  'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters',
  'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker',
  'help', 'html', '|', 'undo', 'redo'

  • align button requires align plugin;
  • color button requires colors plugin;
  • embedly button requires embedly plugin;
  • emoticons button requires emoticons plugin;
  • fontFamily button requires fontFamily plugin;
  • fontSize button requires fontSize plugin;
  • formatOL and formatUL buttons require lists plugin;
  • fullscreen button requires fullscreen plugin;
  • html button requires codeView plugin;
  • inlineStyle button requires inlineStyle plugin;
  • insertFile button requires file plugin;
  • insertImage button requires image plugin;
  • insertLink button requires link plugin;
  • insertTable button requires table plugin;
  • insertVideo button requires video plugin;
  bull; paragraphFormat button requires paragraphFormat plugin;
  • paragraphStyle button requires paragraphStyle plugin;
  • print button requires print plugin;
  • quote button requires quote plugin;
  • specialCharacters button requires specialCharacters plugin;
    */

    this.froalaoptions = {
      charCounterCount: false,
      toolbarButtons: ['bold', 'italic', 'underline', 'color',
      'fontFamily', 'fontSize', 'inlineStyle'],
      inlineStyles: {
        'Small-cap': 'font-variant: small-caps;',
        'normal': 'font-variant: none;'
      }
    };
  }

  save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  /*selectColor(col){
    console.log(col);
    this.input.options.color = col;
  }*/

}
