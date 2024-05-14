import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { RestResponse } from '../models/rest-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | undefined;

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    console.log("in auth", this.user)
    if (!this.user) {
      return this.getUser();
    }
    return false;
  }

  getUser() {
    this.http.get<RestResponse<User>>("/api/user").subscribe(
      resp => console.log(resp)
    );
    return false;
  }

}
