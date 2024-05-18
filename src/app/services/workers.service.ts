import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { WorkersResponse } from "../models/workers-response";
import { RestResponse } from "../models/rest-response";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WorkersService {
  constructor(private http: HttpClient) {}

  getWorkers(
    limit: number = 15,
    offset: number = 0,
  ): Observable<RestResponse<WorkersResponse>> {
    return this.http
      .get<RestResponse<WorkersResponse>>("/api/workers", {
        withCredentials: true,
        params: new HttpParams().set("limit", limit).set("offset", offset),
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return new Observable<RestResponse<WorkersResponse>>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later."),
          );
        }),
      );
  }

  searchWorker(query: string) {
    return this.http
      .get<RestResponse<WorkersResponse>>("/api/workers/search", {
        withCredentials: true,
        params: new HttpParams().set("query", query),
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return new Observable<RestResponse<WorkersResponse>>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later."),
          );
        }),
      );
  }
}
