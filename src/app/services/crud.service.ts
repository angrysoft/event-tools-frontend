import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, Observable, of } from "rxjs";
import { DataListResponse } from "../models/data-list-response";
import { Page } from "../models/page";
import { RestResponse } from "../models/rest-response";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class CrudService<T> {
  readonly http = inject(HttpClient);
  private apiUrl = "";
  private readonly _snackBar = inject(MatSnackBar);
  router = inject(Router);
  auth = inject(AuthService);

  set api(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  get api() {
    return this.apiUrl;
  }

  getAll(
    opts: { limit: number; offset: number; filter?: string } | null = null
  ): Observable<RestResponse<DataListResponse<T>>> {
    return this._get<RestResponse<DataListResponse<T>>>(this.apiUrl, opts);
  }

  getAllPaged(
    opts: { [key: string]: number | string } | null = null
  ): Observable<RestResponse<Page<T>>> {
    return this._get<RestResponse<Page<T>>>(this.apiUrl, opts);
  }

  get(id: number) {
    return this._get<RestResponse<T>>(`${this.apiUrl}/${id}`);
  }

  create(item: Partial<T> | FormData): Observable<RestResponse<void | string>> {
    return this.http
      .post<RestResponse<void | string>>(this.apiUrl, item)
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(
    itemId: number,
    item: Partial<T> | FormData
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(`${this.apiUrl}/${itemId}`, item)
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete(itemId: number): Observable<RestResponse<void | string>> {
    return this.http
      .delete<RestResponse<void | string>>(`${this.apiUrl}/${itemId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  search(
    query: string,
    opts: { limit: number; offset: number; filter?: string } | null = null
  ): Observable<RestResponse<DataListResponse<T>>> {
    let params = { query: query };
    if (opts && Object.keys.length > 0) params = { ...params, ...opts };
    return this._get<RestResponse<DataListResponse<T>>>(
      `${this.apiUrl}/search`,
      params
    );
  }

  searchPaged(
    opts: { [key: string]: string | number } | null = null
  ): Observable<RestResponse<Page<T>>> {
    return this._get<RestResponse<Page<T>>>(`${this.apiUrl}/search`, opts);
  }

  protected _get<GT>(
    api: string,
    params: {
      [key: string]: string | number | boolean | number[];
    } | null = null
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
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected _post<GT>(
    api: string,
    data: GT | null = null
  ): Observable<RestResponse<string>> {
    return this.http
      .post<RestResponse<string>>(api, data, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected _put<GT>(
    api: string,
    data: GT | null = null
  ): Observable<RestResponse<string>> {
    return this.http
      .put<RestResponse<string>>(api, data, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected _delete(
    api: string,
    params: {
      [key: string]: string | number | boolean | number[];
    } | null = null
  ): Observable<RestResponse<string | void>> {
    let reqParams: HttpParams | undefined = undefined;
    if (params && Object.keys(params).length > 0) {
      reqParams = new HttpParams({ fromObject: params });
    }
    return this.http
      .delete<RestResponse<string | void>>(api, {
        withCredentials: true,
        params: reqParams,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected handleError(err: any) {
    if (err.status === 401) {
      // FIXME: wszystkie serwisy powinny obsłużyć on destroy !?
      this.auth.logout();
    } else if (err.status === 413) {
      err.error.data = "Za duży plik";
    }
    return of(err.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showError(err: any) {
    console.warn(err.error);
    this._snackBar.open(err.data ?? "Coś poszło nie tak...", "Zamknij", {
      verticalPosition: "top",
      duration: 5000,
    });
  }

  showMsg(msg: string, duration: number = 3000) {
    this._snackBar.open(msg, "Zamknij", {
      verticalPosition: "top",
      duration: duration,
    });
  }
}
