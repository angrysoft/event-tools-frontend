import { Observable } from "rxjs";
import { Schedule } from "../models/schedule";
import { RestResponse } from "../models/rest-response";

interface ScheduleService {
  getSchedule(
    limit: number,
    offset: number,
    date: string,
  ): Observable<RestResponse<Schedule>>;
}

export { ScheduleService };
