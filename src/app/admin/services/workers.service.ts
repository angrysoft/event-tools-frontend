import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { Worker, WorkersItem } from "../models/worker";
import { WorkerDoc } from "../models/worker-doc";
import { WorkerHints } from "../models/worker-hints";

@Injectable({
  providedIn: "root",
})
export class WorkersService extends CrudService<Worker> {
  private apiWorkers = "/api/admin/workers";

  constructor() {
    super();
    this.setApi(this.apiWorkers);
  }

  getWorkers(
    limit: number = 15,
    offset: number = 0,
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(
      this.apiWorkers,
      {
        limit: limit,
        offset: offset,
      },
    );
  }

  searchWorker(
    query: string,
  ): Observable<RestResponse<DataListResponse<WorkersItem>>> {
    return this._get<RestResponse<DataListResponse<WorkersItem>>>(
      `${this.apiWorkers}/search`,
      {
        query: query,
      },
    );
  }

  getWorkersHints(): Observable<RestResponse<WorkerHints>> {
    return this._get<RestResponse<WorkerHints>>(`${this.apiWorkers}/hints`);
  }

  getWorkersDocs(workerId: number): Observable<RestResponse<WorkerDoc[]>> {
    return this._get<RestResponse<WorkerDoc[]>>(
      `${this.apiWorkers}/doc?workerId=${workerId}`,
    );
  }
}
