import { Injectable } from "@angular/core";
import { RestResponse } from "../models/rest-response";
import { WorkerDoc } from "../models/worker-doc";
import { CrudService } from "./crud.service";
import { DiskSpace } from "../models/dashboard";

@Injectable({
  providedIn: "root",
})
export class DashboardService extends CrudService<WorkerDoc | number> {
  constructor() {
    super();
    this.api = "/api/admin/dashboard";
  }

  getWorkerExpiredDocs() {
    return this._get<RestResponse<WorkerDoc[]>>(
      `${this.api}/worker-expired-docs`
    );
  }
  getCarExpiredDocs() {
    return this._get<RestResponse<{ [key: string]: string }>>(
      `${this.api}/car-expired-docs`
    );
  }

  getDayOffsToAccept() {
    return this._get<RestResponse<number>>(`${this.api}/day-offs-to-accept`);
  }

  getDiskSpaceInfo() {
    return this._get<RestResponse<DiskSpace>>(`${this.api}/disk-space`);
  }
}
