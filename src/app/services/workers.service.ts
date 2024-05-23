import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { WorkerHints } from "../models/worker-hints";
import { WorkersResponse } from "../models/workers-response";

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

  getWorkersHints(): Observable<RestResponse<WorkerHints>> {
    return this.http.get<RestResponse<WorkerHints>>("/api/workers/hints").pipe(
      catchError((err) => {
        if (err.status === 401) {
          return new Observable<RestResponse<WorkerHints>>();
        }
        return throwError(
          () => new Error("Something bad happened; please try again later."),
        );
      }),
    );
  }
}
