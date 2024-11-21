import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { EventDay, EventDaysInfo } from "../../models/events";
import { catchError, Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";

@Injectable({
  providedIn: "root",
})
export class EventDaysService extends CrudService<EventDay> {
  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getDays(eventId: number): Observable<RestResponse<EventDaysInfo>> {
    return this._get<RestResponse<EventDaysInfo>>(`${this.api}/${eventId}/day`);
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
}
