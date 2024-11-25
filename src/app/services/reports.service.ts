import { Injectable } from "@angular/core";
import { CrudService } from "./crud.service";
import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { EventReport } from "../models/reports";

@Injectable({
  providedIn: "root",
})
export class ReportsService extends CrudService<any> {
  
  constructor() {
    super();
    this.api = "/api/admin/reports";
  }

  getEventRaport(eventId: number): Observable<RestResponse<EventReport>> {
    return this._get<RestResponse<EventReport>>(`${this.api}/event/${eventId}`);
  }
  
  getEventRaportForWorkers(eventId: number, workers: number[]) {
    console.log("worker", workers)
    return this._get<RestResponse<EventReport>>(`${this.api}/event/${eventId}`, {workers: workers});
  }
}
