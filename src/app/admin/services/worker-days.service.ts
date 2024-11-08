import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { EventDay, WorkerDay, WorkerDayStatusPayload } from "../models/events";
import { Rate } from "../models/rate";
import { Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { DataListResponse } from "../../models/data-list-response";
import { Addon } from "../models/addon";

@Injectable({
  providedIn: "root",
})
export class WorkerDaysService extends CrudService<WorkerDay> {
  private readonly userApi = "/api/events";
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
    return this._put<WorkerDay[]>(
      `${this.userApi}/${eventId}/day/${dayId}/add`,
      workerDays,
    );
  }

  removeWorkersDays(eventId: number, dayId: number, workerDays: number[]) {
    return this._put<number[]>(
      `${this.userApi}/${eventId}/day/${dayId}/remove`,
      workerDays,
    );
  }

  changeTime(
    eventId: number,
    dayId: number,
    data: {
      workerDays: { [key: number]: string };
      startTime: any;
      endTime: any;
    },
  ) {
    return this._put<{
      workerDays: { [key: number]: string };
      startTime: any;
      endTime: any;
    }>(`${this.userApi}/${eventId}/day/${dayId}/time`, data);
  }

  duplicateDays(
    eventId: number,
    dayId: number,
    payload: { start: string; end: string; workers: WorkerDay[] },
  ) {
    console.log(payload);

    return this._put<{
      [key: number]: string;
    }>(`${this.userApi}/${eventId}/day/${dayId}/duplicate`, payload);
  }

  changeStatus(eventId: number, payload: WorkerDayStatusPayload) {
    return this._put<WorkerDayStatusPayload>(
      `${this.userApi}/${eventId}/day/status`,
      payload,
    );
  }

  getStatuses() {
    return this._get<RestResponse<{ [key: string]: string }>>(
      `${this.userApi}/day/statuses`,
    );
  }
}
