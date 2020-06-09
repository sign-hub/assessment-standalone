import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Email } from '../_model/email';
import { RecoveryService } from '../_services/recovery.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-recovery',
  templateUrl: '../_views/recoverypassword.component.html',
  styleUrls: ['../_views/recoverypassword.component.scss', '../../share/base.scss']
})
export class RecoveryPasswordComponent {
  buttonLoading: boolean;
  e: Email;

  constructor(private router: Router,
    public location: Location,
    private recoveryService: RecoveryService) {
    this.e = new Email();
  }

  sendPassword() {
    this.buttonLoading = true;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        email: this.e.email
      }
    };
    this.recoveryService.requestPost('passwordRecover', { login: this.e.email }).subscribe(res => {
      this.buttonLoading = false;
      if (res.status == 'OK') {
        this.router.navigate(['/authen/forgetpassword'], navigationExtras);
      } else {
        console.error('Server error');
      }
    });
  }

  changePassword() {
    this.router.navigate(['/authen/forgetpassword']);
  }
  back() {
    console.log('clicked');
    this.location.back();
  }
}
