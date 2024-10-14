import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { BasicPayData } from "../models/rate";
import { Worker, WorkersItem } from "../models/worker";
import { WorkerHints } from "../models/worker-hints";

@Injectable({
  providedIn: "root",
})
export class WorkersService extends CrudService<Worker> {
  private readonly apiWorkers = "/api/admin/workers";

  constructor() {
    super();
    this.api = this.apiWorkers;
  }

  getWorkers(
    limit: number = 15,
    offset: number = 0,
    filter: string = "",
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(
      this.apiWorkers,
      {
        limit: limit,
        offset: offset,
        filterTeam: filter,
      },
    );
  }

  searchWorker(
    query: string,
    limit: number = 15,
    offset: number = 0,
    filter: string = "",
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(
      `${this.apiWorkers}/search`,
      {
        query: query,
        limit: limit,
        offset: offset,
        filterTeam: filter,
      },
    );
  }

  getWorkersHints(): Observable<RestResponse<WorkerHints>> {
    return this._get<RestResponse<WorkerHints>>(`${this.apiWorkers}/hints`);
  }

  updateBasicPay(
    workerId: number,
    basicPay: Partial<BasicPayData>,
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(
        `${this.apiWorkers}/basic/${workerId}`,
        basicPay,
      )
      .pipe(catchError(this.handleError));
  }
}
