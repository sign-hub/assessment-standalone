import { Routes } from '@angular/router';

import { AuthenRouter } from './authen/authen.routing';
import { TestingToolRouting } from './testingtool/testingtool.routing';
let redirect = 'testlist';

if (navigator.onLine){
	 redirect = 'testdownload';
}else{
	 redirect = 'testlist';
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: redirect,
    pathMatch: 'full'
  },
  ...TestingToolRouting,
  ...AuthenRouter
];
