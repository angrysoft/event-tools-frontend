import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { EventDay, WorkerDay } from "../models/events";
import { Rate } from "../models/rate";
import { Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { DataListResponse } from "../../models/data-list-response";
import { Addon } from "../models/addon";

@Injectable({
  providedIn: "root",
})
export class WorkerDaysService extends CrudService<WorkerDay> {
  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getRates(): Observable<RestResponse<DataListResponse<Rate>>> {
    const url = "/api/admin/workers/rates";
    return this._get<RestResponse<DataListResponse<Rate>>>(url);
  }

  getAddons(): Observable<RestResponse<DataListResponse<Addon>>> {
    const url = "/api/admin/workers/addons";
    return this._get<RestResponse<DataListResponse<Addon>>>(url);
  }

  getEventDay(
    eventId: number,
    dayId: number,
  ): Observable<RestResponse<EventDay>> {
    return this._get<RestResponse<EventDay>>(
      `${this.api}/${eventId}/day/${dayId}`,
    );
  }

  storeEventDay(eventId: number, dayId: number, workerDays: WorkerDay[]) {
    return this._put<WorkerDay[]>(`${this.api}/${eventId}/day/${dayId}`, workerDays);
  }
}
