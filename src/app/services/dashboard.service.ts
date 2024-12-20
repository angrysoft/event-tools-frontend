import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { RestResponse } from '../models/rest-response';
import { WorkerDoc } from '../models/worker-doc';
import { DayOff } from '../models/schedule';

@Injectable({
  providedIn: "root",
})
export class DashboardService extends CrudService<any> {
  userApi = "/api/dashboard";

  constructor() {
    super();
    this.api = "/api/admin/dashboard";
  }

  getWorkerExpiredDocs() {
    return this._get<RestResponse<WorkerDoc[]>>(
      `${this.api}/worker-expired-docs`
    );
  }

  getDayOffToAccept() {
    return this._get<RestResponse<DayOff[]>>(
      `${this.api}/day-off-to-accept`
    );
  }
}
