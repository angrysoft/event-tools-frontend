import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RestResponse } from "../models/rest-response";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user: User | undefined;

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    console.log("user", this.user);
    if (this.user) {
      return true;
    }
    // this.getUser();
    return false;
  }

  getUser() {
    this.http
      .get<RestResponse<User>>("/api/user", { withCredentials: true })
      .subscribe((resp) => {
        if (resp.ok) {
          this.user = resp.data;
        }
      });

      console.log("user aaa", this.user)
  }

  login(username: string, password: string) {
    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    let result = false;
    this.http
      .post<RestResponse<User>>("/api/user/login", formData)
      .subscribe((response) => {
        if (response.ok) {
          this.user = response.data;
          result = true;
          console.log(this.user);
        }
      });
      
    return result;
  }

  logout() {
    console.log("logout");
  }
}
