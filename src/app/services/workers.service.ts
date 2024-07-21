import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { WorkerHints } from "../models/worker-hints";
import { WorkerDetails } from "../models/worker-details";
import { WorkersResponse } from "../models/workers-response";
import { WorkerRequest } from "../models/worker-request";

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

  getWorker(id: number): Observable<RestResponse<WorkerDetails>> {
    return this.http
      .get<RestResponse<WorkerDetails>>(`/api/workers/${id}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return new Observable<RestResponse<WorkerDetails>>();
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

  addWorker(worker: WorkerRequest) {
    return this.http.post<RestResponse<void>>("/api/workers", worker).pipe(
      catchError((err) => {
        console.log(err.error);
        if (err.status === 401) {
          return new Observable<RestResponse<void>>();
        } else if (err.status === 400) {
          return throwError(() => new Error(err.error.error));
        }
        return throwError(
          () => new Error("Something bad happened; please try again later."),
        );
      }),
    );
  }

  updateWorker(worker: WorkerRequest) {
    return this.http.put<RestResponse<void>>("/api/workers", worker).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 400) {
          console.log();
          return new Observable<RestResponse<void>>();
        }
        return throwError(
          () => new Error("Something bad happened; please try again later."),
        );
      }),
    );
  }
}
