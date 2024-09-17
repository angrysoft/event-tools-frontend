import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { RestResponse } from '../models/rest-response';
import { DataListResponse } from '../models/ldata-list-response';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {
  readonly http = inject(HttpClient);
  private api = "";

  constructor() {
  }

  setApi(apiUrl: string) {
    this.api = apiUrl;
  }

  getAll(): Observable<RestResponse<DataListResponse<T>>> {
    return this._get<RestResponse<DataListResponse<T>>>(this.api);
  }

  get(id:number) {
    return this._get<RestResponse<T>>(`${this.api}/${id}`);
  }

  private _get<GT>(
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
}
