import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

@Injectable()
export class UserService {

  public AuthUrl: string = 'http://192.168.1.170/FarmerAPI/api/Auth/Authenticate';
  constructor(private http: HttpClient) { }
  public data: vmAuth = new vmAuth();

  userAuthentication(userName: string, password: string) {
    this.data = {
      account: userName,
      password: password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    })
    return this.http.post(this.AuthUrl, this.data, { headers });
  }
}

export class vmAuth {
  account: string;
  password: string;
}