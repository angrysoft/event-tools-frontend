import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { Worker } from "../models/worker";
import { WorkerHints } from "../models/worker-hints";
import { WorkersResponse } from "../models/workers-response";

@Injectable({
  providedIn: "root",
})
export class WorkersService {
  readonly http = inject(HttpClient);

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

  getWorker(id: number): Observable<RestResponse<Worker>> {
    return this.http
      .get<RestResponse<Worker>>(`/api/workers/${id}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return new Observable<RestResponse<Worker>>();
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

  addWorker(worker: Partial<Worker>) {
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

  updateWorker(worker: Partial<Worker>) {
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

  removeWorker(workerId: number) {
    return this.http
      .delete<RestResponse<void>>(`/api/workers/${workerId}`)
      .pipe(
        catchError((err) => {
          if (err.status === 401 || err.status === 400) {
            return new Observable<RestResponse<void>>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later."),
          );
        }),
      );
  }
}
