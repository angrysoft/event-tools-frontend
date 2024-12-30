import { Injectable } from "@angular/core";
import {
  EventReport,
  FromDatesReport,
  MonthReport,
  PlanExecutionReport,
} from "../models/reports";
import { RestResponse } from "../models/rest-response";
import { CrudService } from "./crud.service";

@Injectable({
  providedIn: "root",
})
export class ReportsService extends CrudService<
  EventReport | MonthReport | FromDatesReport | PlanExecutionReport
> {
  constructor() {
    super();
    this.api = "/api/reports";
  }

  // getEventRaport(eventId: number): Observable<RestResponse<EventReport>> {
  //   return this._get<RestResponse<EventReport>>(`${this.api}/event/${eventId}`);
  // }

  getEventRaportForWorkers(eventId: number, workers: number[]) {
    return this._get<RestResponse<EventReport>>(
      `${this.api}/event/${eventId}`,
      { workers: workers }
    );
  }

  getMonthRaportForWorkers(
    worker: number,
    month: number | string,
    year: number | string
  ) {
    return this._get<RestResponse<MonthReport>>(
      `${this.api}/month/worker/${worker}/${month}/${year}`
    );
  }

  getOwnMonthRaportForWorker(month: number | string, year: number | string) {
    return this._get<RestResponse<MonthReport>>(
      `/api/worker-reports/month/worker/${month}/${year}`
    );
  }

  getMonthRaportForTeam(
    team: number,
    month: number | string,
    year: number | string
  ) {
    return this._get<RestResponse<MonthReport>>(
      `${this.api}/month/team/${team}/${month}/${year}`
    );
  }

  getWorkersRaportForBetween(from: string, to: string, reportMembers: string) {
    return this._get<RestResponse<FromDatesReport>>(
      `${this.api}/from-dates/workers`,
      {
        from: from,
        to: to,
        workers: reportMembers,
      }
    );
  }
  getTeamRaportForBetween(from: string, to: string, reportMember: string) {
    return this._get<RestResponse<FromDatesReport>>(
      `${this.api}/from-dates/team`,
      {
        from: from,
        to: to,
        team: reportMember,
      }
    );
  }

  getPlanExecutionReport(eventId: number) {
    return this._get<RestResponse<PlanExecutionReport>>(
      `${this.api}/plan-execution/${eventId}`
    );
  }
}
