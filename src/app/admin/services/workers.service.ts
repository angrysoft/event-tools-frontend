import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { BasicPayData } from "../models/rate";
import { OfficeWorkers, Worker, WorkerBase, WorkersItem } from "../models/worker";
import { WorkerHints } from "../models/worker-hints";

@Injectable({
  providedIn: "root",
})
export class WorkersService extends CrudService<Worker> {
  constructor() {
    super();
    this.api = "/api/admin/workers";
  }

  getWorkers(
    limit: number = 15,
    offset: number = 0,
    filter: string = "",
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(this.api, {
      limit: limit,
      offset: offset,
      filterTeam: filter,
    });
  }

  searchWorker(
    query: string,
    limit: number = 15,
    offset: number = 0,
    filter: string = "",
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(
      `${this.api}/search`,
      {
        query: query,
        limit: limit,
        offset: offset,
        filterTeam: filter,
      },
    );
  }

  getWorkersHints(): Observable<RestResponse<WorkerHints>> {
    return this._get<RestResponse<WorkerHints>>(`${this.api}/hints`);
  }

  updateBasicPay(
    workerId: number,
    basicPay: Partial<BasicPayData>,
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(
        `${this.api}/basic/${workerId}`,
        basicPay,
      )
      .pipe(catchError(this.handleError));
  }

  getWorkersNames(
    workersIds: number[],
  ): Observable<RestResponse<WorkerBase[]>> {
    return this._get<RestResponse<WorkerBase[]>>(`${this.api}/ids`, {
      ids: workersIds.join(","),
    });
  }

  getOfficeWorkers(): Observable<RestResponse<OfficeWorkers>> {
    return this._get<RestResponse<OfficeWorkers>>("/api/admin/workers/office");
  }
}
