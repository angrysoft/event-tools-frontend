import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import {
  ChangeWorkerPayload,
  DuplicateDaysPayload,
  EventDay,
  WorkerDay,
  WorkerDayStatusPayload,
  WorkersRateDay,
} from "../../models/events";
import { Rate } from "../models/rate";
import { Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { DataListResponse } from "../../models/data-list-response";
import { Addon } from "../models/addon";
import { ScheduleService } from "../../services/schedule.service";
import { Schedule } from "../../models/schedule";
import { CalendarDay } from "../../models/calendar";

@Injectable({
  providedIn: "root",
})
export class WorkerDaysService
  extends CrudService<WorkerDay>
  implements ScheduleService
{
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
    dayId: number
  ): Observable<RestResponse<EventDay>> {
    return this._get<RestResponse<EventDay>>(
      `${this.api}/${eventId}/day/${dayId}`
    );
  }

  storeEventDay(eventId: number, dayId: number, workerDays: WorkerDay[]) {
    return this._put<WorkerDay[]>(
      `${this.userApi}/${eventId}/day/${dayId}/add`,
      workerDays
    );
  }

  removeWorkersDays(eventId: number, dayId: number, workerDays: number[]) {
    return this._put<number[]>(
      `${this.userApi}/${eventId}/day/${dayId}/remove`,
      workerDays
    );
  }

  removeWorkersFromEvent(eventId: number, workers: number[]) {
    return this._put<number[]>(
      `${this.userApi}/${eventId}/remove/workers`,
      workers
    );
  }

  changeTime(
    eventId: number,
    dayId: number,
    data: {
      workerDays: { [key: number]: string };
      startTime: any;
      endTime: any;
    }
  ) {
    return this._put<{
      workerDays: { [key: number]: string };
      startTime: any;
      endTime: any;
    }>(`${this.userApi}/${eventId}/day/${dayId}/time`, data);
  }

  duplicateDays(eventId: number, dayId: number, payload: DuplicateDaysPayload) {
    return this._put<DuplicateDaysPayload>(
      `${this.userApi}/${eventId}/day/${dayId}/duplicate`,
      payload
    );
  }

  changeStatus(eventId: number, payload: WorkerDayStatusPayload) {
    return this._put<WorkerDayStatusPayload>(
      `${this.userApi}/${eventId}/day/status`,
      payload
    );
  }

  getStatuses() {
    return this._get<RestResponse<{ [key: string]: string }>>(
      `${this.userApi}/day/statuses`
    );
  }

  changeRates(eventId: number, dayId: number, payload: WorkersRateDay[]) {
    return this._put<WorkersRateDay[]>(
      `${this.userApi}/${eventId}/day/${dayId}/rates`,
      payload
    );
  }

  changeWorker(eventId: number, dayId: number, payload: ChangeWorkerPayload) {
    return this._put<ChangeWorkerPayload>(
      `${this.userApi}/${eventId}/day/${dayId}/worker`,
      payload
    );
  }

  getSchedule(
    limit: number,
    offset: number,
    date: string
  ): Observable<RestResponse<Schedule>> {
    return this._get<RestResponse<Schedule>>(`${this.userApi}/schedule`, {
      limit: limit,
      offset: offset,
      date: date,
    });
  }

  getCalendar(date: string): Observable<RestResponse<CalendarDay[]>> {
    return this._get<RestResponse<CalendarDay[]>>(`${this.userApi}/calendar`, {
      date: date,
    });
  }

  addDaysOff(payload: { from: string; to: string; worker: number }) {
    return this._put(`${this.userApi}/day-off`, payload);
  }

  acceptDayOff(id: any) {
    return this._put(`${this.api}/day-off/${id}/accept`);
  }
  rejectDayOff(id: any) {
    return this._put(`${this.api}/day-off/${id}/reject`);
  }
  removeDayOff(id: any) {
    return this._delete(`${this.userApi}/day-off/${id}`);
  }
}
