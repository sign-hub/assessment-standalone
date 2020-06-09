import { Route } from '@angular/router';
import { AuthenComponent } from './_controller/authen.component';

export const AuthenRouter: Route[] = [
  {
    path: 'authen',
    component: AuthenComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: 'app/login/login.module#LoginModule'
      },
      {
        path: 'forgetpassword',
        loadChildren: 'app/forgetPassword/forgetPassword.module#ForgetPasswordModule'
      },
      {
        path: 'recoverypassword',
        loadChildren: 'app/recoverypassword/revoverypassword.module#RecoveryPasswordModule'
      }
    ]
  }
];
