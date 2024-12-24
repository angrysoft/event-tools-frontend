import { Injectable } from "@angular/core";
import { RestResponse } from "../models/rest-response";
import { WorkerDoc } from "../models/worker-doc";
import { CrudService } from "./crud.service";

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

  getDayOffsToAccept() {
    return this._get<RestResponse<number>>(`${this.api}/day-offs-to-accept`);
  }
}
