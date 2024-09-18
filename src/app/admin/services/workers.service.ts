import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { Worker, WorkersItem } from "../models/worker";
import { WorkerHints } from "../models/worker-hints";
import { WorkerDoc } from "../models/worker-doc";
import { DataListResponse } from "../../models/data-list-response";

@Injectable({
  providedIn: "root",
})
export class WorkersService {
  readonly http = inject(HttpClient);
  private apiWorkers = "/api/admin/workers";

  getWorkers(
    limit: number = 15,
    offset: number = 0,
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this.get<DataListResponse<WorkersItem>>(this.apiWorkers, {
      limit: limit,
      offset: offset,
    });
  }

  getWorker(id: number): Observable<RestResponse<Worker>> {
    return this.get<Worker>(`${this.apiWorkers}/${id}`);
  }

  searchWorker(query: string) {
    return this.get<DataListResponse<WorkersItem>>(
      `${this.apiWorkers}/search`,
      {
        query: query,
      },
    );
  }

  getWorkersHints(): Observable<RestResponse<WorkerHints>> {
    return this.get<WorkerHints>(`${this.apiWorkers}/hints`);
  }

  addWorker(worker: Partial<Worker>) {
    return this.http.post<RestResponse<void>>(this.apiWorkers, worker).pipe(
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
    return this.http.put<RestResponse<string>>(this.apiWorkers, worker).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 400) {
          return new Observable<RestResponse<string>>((observer) => {
            observer.next(err.error);
            observer.complete();
          });
        }
        return throwError(
          () => new Error("Something bad happened; please try again later."),
        );
      }),
    );
  }

  removeWorker(workerId: number) {
    return this.http
      .delete<RestResponse<void>>(`${this.apiWorkers}/${workerId}`)
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

  getWorkersDocs(workerId: number): Observable<RestResponse<WorkerDoc[]>> {
    return this.get<WorkerDoc[]>(`${this.apiWorkers}/doc?workerId=${workerId}`);
  }

  private get<T>(
    api: string,
    params: { [key: string]: string | number | boolean } | null = null,
  ): Observable<RestResponse<T>> {
    let reqParams: HttpParams | undefined = undefined;
    if (params && Object.keys(params).length > 0) {
      reqParams = new HttpParams({ fromObject: params });
    }
    return this.http
      .get<RestResponse<T>>(api, {
        withCredentials: true,
        params: reqParams,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return new Observable<RestResponse<T>>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later."),
          );
        }),
      );
  }
}
