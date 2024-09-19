import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, inject, Injectable, Output } from "@angular/core";
import { Observable, catchError, of, throwError } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { DataListResponse } from "../models/data-list-response";

@Injectable({
  providedIn: "root",
})
export class CrudService<T> {
  readonly http = inject(HttpClient);
  private api = "";

  @Output()
  authenticated = new EventEmitter<boolean>();

  constructor() {}

  setApi(apiUrl: string) {
    this.api = apiUrl;
  }

  getAll(): Observable<RestResponse<DataListResponse<T>>> {
    return this._get<RestResponse<DataListResponse<T>>>(this.api);
  }

  getAllLimitAndOffset(
    limit: number,
    offset: number,
  ): Observable<RestResponse<DataListResponse<T>>> {
    return this._get<RestResponse<DataListResponse<T>>>(this.api, {
      limit: limit,
      offset: offset,
    });
  }

  get(id: number) {
    return this._get<RestResponse<T>>(`${this.api}/${id}`);
  }

  create(item: Partial<T>): Observable<RestResponse<void | string>> {
    return this.http
      .post<RestResponse<void | string>>(this.api, item)
      .pipe(catchError(this.handleError));
  }

  update(item: Partial<T>): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(this.api, item)
      .pipe(catchError(this.handleError));
  }

  delete(itemId: number): Observable<RestResponse<void | string>> {
    return this.http
      .delete<RestResponse<void | string>>(`${this.api}/${itemId}`)
      .pipe(
        catchError(this.handleError),
      );
  }

  protected _get<GT>(
    api: string,
    params: { [key: string]: string | number | boolean } | null = null,
  ): Observable<GT> {
    let reqParams: HttpParams | undefined = undefined;
    if (params && Object.keys(params).length > 0) {
      reqParams = new HttpParams({ fromObject: params });
    }
    return this.http
      .get<GT>(api, {
        withCredentials: true,
        params: reqParams,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return new Observable<GT>();
          }
          return throwError(
            () => new Error("Something bad happened; please try again later."),
          );
        }),
      );
  }

  protected handleError(err: any) {
    switch (err.status) {
      case 401:
        return new Observable<RestResponse<string>>();
      case 400:
        return throwError(() => new Error(err.error.error));
      case 409:
        return of(err.error);
      default:
        return throwError(
          () => new Error("Something bad happened; please try again later."),
        );
    }
  }
}
