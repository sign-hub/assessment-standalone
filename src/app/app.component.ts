import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

// declare var require : any;
// const Datastore = require('nedb');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app works!';
  constructor(public _electronService: ElectronService) {
    if (!!this._electronService.remote) {
      const fs = this._electronService.remote.getGlobal('fs');
      const base_path = this._electronService.remote.app.getAppPath();
      if (!fs.existsSync(base_path + '/medias')) {
        fs.mkdirSync(base_path + '/medias');
      }
      if (!fs.existsSync(base_path + '/temps')) {
        fs.mkdirSync(base_path + '/temps');
      }
    }

  }

}

