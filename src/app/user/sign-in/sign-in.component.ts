import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../shared-service';
import { AuthService } from '../../../api/system_auth/auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  // providers: [AuthService] // 已在app.module.ts統一provide了
})
export class SignInComponent implements OnInit {

  hide = true;
  isLoginError = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
  ) {

  }

  ngOnInit() {
  }

  onSubmit(account: string, password: string) {
    this.authService.userAuthentication(account, password).subscribe((data: any) => {
      localStorage.setItem('userToken', data.access_token);
      console.log('Sign in success!');

      // 觸發事件，讓menu監聽此事件，並觸發rebuildMenu以動態產生選單
      // this.SignEvent.emit(null);
      this.sharedService.emitChange('sign-in onSubmitemit=>navmenu');

      // 登入成功後重新導向至首頁
      this.router.navigate(['/Home']);
    }, (error: HttpErrorResponse) => {
      console.log(error);
      localStorage.removeItem('userToken');
      this.isLoginError = true;
    });
  }

}
