import { HttpClient } from "@angular/common/http";
import { EventEmitter, inject, Injectable, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: User | undefined;

  @Output()
  authenticated = new EventEmitter<boolean>();

  @Output()
  loginError = new EventEmitter<string>();
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);

  constructor() {
    this.authenticated.subscribe((auth) => {
      let url: string = "/login";
      if (auth) {
        switch (this.user?.authority) {
          case "ROLE_ADMIN":
          case "ROLE_COORDINATOR":
            url = "/admin/dashboard";
            break;
          case "ROLE_WORKER":
            url = "/worker";
            break;
          default:
            url = "/login";
            break;
        }
      }
      this.router.navigateByUrl(url, { replaceUrl: true });
    });
  }

  isAuthenticated(): boolean {
    if (this.user) {
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    if (
      this.user &&
      (this.user.authority === "ROLE_ADMIN" ||
        this.user.authority === "ROLE_COORDINATOR")
    )
      return true;
    return false;
  }

  getUser() {
    this.http
      .get<RestResponse<User>>("/api/workers/whoami", { withCredentials: true })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.authenticated.emit(false);
            return new Observable<RestResponse<User>>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later.")
          );
        })
      )
      .subscribe((resp) => {
        if (resp.ok) {
          this.user = resp.data;
          this.authenticated.emit(true);
        }
      });
  }

  checkAuth() {
    if (this.isAuthenticated()) {
      this.authenticated.emit(true);
    }
  }

  login(username: string, password: string) {
    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    this.http
      .post<RestResponse<User>>("/api/user/login", formData, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.loginError.emit(err.error.error);
            return new Observable<RestResponse<User>>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later.")
          );
        })
      )
      .subscribe((response) => {
        if (response.ok) {
          this.user = response.data;
          this.authenticated.emit(true);
        }
      });
  }

  logout() {
    return this.http
      .post("/api/user/logout", null, { withCredentials: true })
      .subscribe(() => {
        this.user = undefined;
        this.authenticated.emit(false);
      });
  }
}
