import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, inject, Injectable, Output } from "@angular/core";
import { Observable, catchError, of, throwError } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { DataListResponse } from "../models/data-list-response";
import { Page } from "../models/page";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class CrudService<T> {
  readonly http = inject(HttpClient);
  private apiUrl = "";
  private readonly _snackBar = inject(MatSnackBar);

  @Output()
  authenticated = new EventEmitter<boolean>();

  constructor() {}

  set api(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  get api() {
    return this.apiUrl;
  }

  getAll(
    opts: { limit: number; offset: number; filter?: string } | null = null,
  ): Observable<RestResponse<DataListResponse<T>>> {
    return this._get<RestResponse<DataListResponse<T>>>(this.apiUrl, opts);
  }

  getAllPaged(
    opts: { [key: string]: any } | null = null,
  ): Observable<RestResponse<Page<T>>> {
    return this._get<RestResponse<Page<T>>>(this.apiUrl, opts);
  }

  get(id: number) {
    return this._get<RestResponse<T>>(`${this.apiUrl}/${id}`);
  }

  create(item: Partial<T> | FormData): Observable<RestResponse<void | string>> {
    return this.http
      .post<RestResponse<void | string>>(this.apiUrl, item)
      .pipe(catchError(this.handleError));
  }

  update(
    itemId: number,
    item: Partial<T> | FormData,
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(`${this.apiUrl}/${itemId}`, item)
      .pipe(catchError(this.handleError));
  }

  delete(itemId: number): Observable<RestResponse<void | string>> {
    return this.http
      .delete<RestResponse<void | string>>(`${this.apiUrl}/${itemId}`)
      .pipe(catchError(this.handleError));
  }

  search(
    query: string,
    opts: { limit: number; offset: number; filter?: string } | null = null,
  ): Observable<RestResponse<DataListResponse<T>>> {
    let params = { query: query };
    if (opts && Object.keys.length > 0) params = { ...params, ...opts };
    return this._get<RestResponse<DataListResponse<T>>>(
      `${this.apiUrl}/search`,
      params,
    );
  }

  searchPaged(
    opts: { [key: string]: string } | null = null,
  ): Observable<RestResponse<Page<T>>> {
    console.log(opts);
    return this._get<RestResponse<Page<T>>>(`${this.apiUrl}/search`, opts);
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
        return of(err.error);
      case 409:
        return of(err.error);
      default:
        return throwError(
          () => new Error("Something bad happened; please try again later."),
        );
    }
  }

  showError(err: any) {
    console.warn(err.error);
    this._snackBar.open(err.data ?? "Coś poszło nie tak...", "Zamknij", {
      verticalPosition: "top",
    });
  }
}
