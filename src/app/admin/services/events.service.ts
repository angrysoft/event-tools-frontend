import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { RestResponse } from "../../models/rest-response";
import { OfficeWorkers } from "../models/worker";
import { Observable } from "rxjs";
import { EventItem, EventItemDto } from "../models/events";

@Injectable({
  providedIn: "root",
})
export class EventsService extends CrudService<EventItem | EventItemDto> {
  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getOfficeWorkers(): Observable<RestResponse<OfficeWorkers>> {
    return this._get<RestResponse<OfficeWorkers>>("/api/admin/workers/office");
  }

  getInfo(eventId: number) {
    return this._get<RestResponse<EventItemDto>>(
      `${this.api}/info/${eventId}`,
    );
  }
}
