import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { DataListResponse } from "../models/data-list-response";
import { RestResponse } from "../models/rest-response";
import { CrudService } from "./crud.service";
import { BasicPayData } from "../models/rate";
import {
  OfficeWorkers,
  Worker,
  WorkerBase,
  WorkersItem,
} from "../models/worker";
import { WorkerHints } from "../models/worker-hints";
import { Page } from "../models/page";

@Injectable({
  providedIn: "root",
})
export class WorkersService extends CrudService<Worker> {
  private readonly userApi = "/api/workers";
  constructor() {
    super();
    this.api = "/api/admin/workers";
  }

  getWorkers(
    limit: number = 15,
    offset: number = 0,
    filter: string = ""
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(this.api, {
      limit: limit,
      offset: offset,
      filterTeam: filter,
    });
  }

  getAllWorkerPaged(
    opts: { [key: string]: number | string } | null = null
  ): Observable<RestResponse<Page<WorkerBase>>> {
    return this._get<RestResponse<Page<WorkerBase>>>(this.userApi, opts);
  }

  searchWorker(
    query: string,
    limit: number = 15,
    offset: number = 0,
    filter: string = ""
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(
      `${this.api}/search`,
      {
        query: query,
        limit: limit,
        offset: offset,
        filterTeam: filter,
      }
    );
  }

  searchWorkerPaged(
    opts: { [key: string]: string | number } | null = null
  ): Observable<RestResponse<Page<WorkerBase>>> {
    return this._get<RestResponse<Page<WorkerBase>>>(
      `${this.userApi}/search`,
      opts
    );
  }

  getWorkersHints(): Observable<RestResponse<WorkerHints>> {
    return this._get<RestResponse<WorkerHints>>(`${this.userApi}/hints`);
  }

  updateBasicPay(
    workerId: number,
    basicPay: Partial<BasicPayData>
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(
        `${this.api}/basic/${workerId}`,
        basicPay
      )
      .pipe(catchError(this.handleError));
  }

  getWorkersNames(
    workersIds: number[]
  ): Observable<RestResponse<WorkerBase[]>> {
    return this._get<RestResponse<WorkerBase[]>>(`${this.api}/ids`, {
      ids: workersIds.join(","),
    });
  }

  getOfficeWorkers(): Observable<RestResponse<OfficeWorkers>> {
    return this._get<RestResponse<OfficeWorkers>>("/api/admin/workers/office");
  }

  getWorkerContact(workerId: number) {
    return this._get<RestResponse<WorkerBase>>(`${this.userApi}/${workerId}`);
  }

  getAboutMe() {
    return this._get<RestResponse<Worker>>(`${this.userApi}/about-me`);
  }

  changePassword(
    payload: Partial<{ password: string | null; password2: string | null }>
  ) {
    return this._put(`${this.userApi}/change-password`, payload);
  }
}
