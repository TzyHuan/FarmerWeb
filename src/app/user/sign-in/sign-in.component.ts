import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../shared/user.service';
import { vmMenu } from '../../navmenu/navmenu';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [UserService]
})
export class SignInComponent implements OnInit {

  isLoginError: boolean = false;

  constructor(private AuthREST: UserService, private router: Router) { }

  ngOnInit() {
  }

  OnSubmit(account: string, password: string) {    
    this.AuthREST.userAuthentication(account, password)
    .subscribe((data: any) => {
      //console.log(data.token_type);
      //console.log(data.access_token);
      localStorage.setItem('userToken', data.access_token);
      console.log('Sign in success!')
      this.router.navigate(['/Home']);
    },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
      });
  }

}
