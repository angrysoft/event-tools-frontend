import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Addon } from "../models/addon";
import { CalendarDay } from "../models/calendar";
import { DataListResponse } from "../models/data-list-response";
import {
  ChangeWorkerPayload,
  DuplicateDaysPayload,
  EventDay,
  WorkerDay,
  WorkerDayStatusPayload,
  WorkersRateDay,
} from "../models/events";
import { Page } from "../models/page";
import { Rate } from "../models/rate";
import { RestResponse } from "../models/rest-response";
import { DayOff, Schedule } from "../models/schedule";
import { ChangeWorkerInDatesPayload } from "../models/events";
import { CrudService } from "./crud.service";
import { ScheduleService } from "./schedule.service";

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
    const url = "/api/workers/rates";
    return this._get<RestResponse<DataListResponse<Rate>>>(url);
  }

  getAddons(): Observable<RestResponse<DataListResponse<Addon>>> {
    const url = "/api/workers/addons";
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
      startTime: Date | string;
      endTime: Date | string;
    }
  ) {
    return this._put<{
      workerDays: { [key: number]: string };
      startTime: Date | string;
      endTime: Date | string;
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
      `${this.api}/${eventId}/day/status`,
      payload
    );
  }

  stateChiefToCoor(eventId: number, payload: number[]) {
    return this._put<number[]>(
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

  changeWorkerInDates(eventId: number, payload: ChangeWorkerInDatesPayload) {
    return this._put<ChangeWorkerInDatesPayload>(
      `${this.userApi}/${eventId}/worker/change`,
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

  workerDaysOffRequest(payload: { from: string; to: string }) {
    return this._put(`${this.userApi}/day-off/request`, payload);
  }

  acceptDayOff(id: number) {
    return this._put(`${this.api}/day-off/${id}/accept`);
  }
  rejectDayOff(id: number) {
    return this._put(`${this.api}/day-off/${id}/reject`);
  }
  removeDayOff(id: number) {
    return this._delete(`${this.userApi}/day-off/${id}`);
  }

  getDayOffToAccept(pageNumber: number, pageSize: number) {
    return this._get<RestResponse<Page<DayOff>>>("/api/admin/day-offs", {
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  }

  acceptDayOffs(days: number[]) {
    return this._put("/api/admin/day-offs", days);
  }

  removeDayOffs(days: number[]) {
    return this._delete("/api/admin/day-offs", {days: days.join(",")});
  }
}
