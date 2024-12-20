import { Injectable } from "@angular/core";
import { CrudService } from "./crud.service";
import { EventDay, EventDaysInfo } from "../models/events";
import { catchError, Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";

@Injectable({
  providedIn: "root",
})
export class EventDaysService extends CrudService<EventDay> {
  userApi = "/api/events";
  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getDays(eventId: number): Observable<RestResponse<EventDaysInfo>> {
    return this._get<RestResponse<EventDaysInfo>>(`${this.api}/${eventId}/day`);
  }

  getDaysChief(eventId: number): Observable<RestResponse<EventDaysInfo>> {
    return this._get<RestResponse<EventDaysInfo>>(
      `${this.userApi}/${eventId}/day`
    );
  }

  getDaysWorker(eventId: number): Observable<RestResponse<EventDaysInfo>> {
    return this._get<RestResponse<EventDaysInfo>>(
      `${this.userApi}/${eventId}/day/worker`
    );
  }

  addDay(eventId: number, day: EventDay) {
    return this.http
      .post(`${this.api}/${eventId}/day`, day)
      .pipe(catchError(this.handleError));
  }

  delDay(eventId: number, dayId: number) {
    return this.http
      .delete(`${this.api}/${eventId}/day/${dayId}`)
      .pipe(catchError(this.handleError));
  }

  getStatuses() {
    return this._get<RestResponse<{ [key: string]: string }>>(
      `${this.userApi}/day/statuses`
    );
  }

  changeInfo(eventId: number, dayId: number, info: string) {
    return this._put(`${this.api}/${eventId}/day/${dayId}/info`, {
      info: info,
    });
  }
}
