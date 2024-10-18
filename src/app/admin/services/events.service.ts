import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { RestResponse } from "../../models/rest-response";
import { OfficeWorkers } from "../models/worker";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventsService extends CrudService<Event> {
  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getOfficeWorkers(): Observable<RestResponse<OfficeWorkers>> {
    return this._get<RestResponse<OfficeWorkers>>("/api/admin/workers/office");
  }
}
