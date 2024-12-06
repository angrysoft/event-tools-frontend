import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import {
  Rate,
  RateType,
  RateValue,
  RateValueDto,
  RateValueNamesDto,
} from "../models/rate";
import { DataListResponse } from "../../models/data-list-response";
import { catchError, Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";

@Injectable({
  providedIn: "root",
})
export class RatesService extends CrudService<Rate> {
  userApi = "/api/workers/rates";

  constructor() {
    super();
    this.api = "/api/admin/workers/rates";
  }

  getRateTypes(): Observable<RestResponse<DataListResponse<RateType>>> {
    return this._get<RestResponse<DataListResponse<RateType>>>(
      `${this.api}/types`
    );
  }

  getWorkerRates(
    workerId: number
  ): Observable<RestResponse<DataListResponse<RateValueDto>>> {
    return this._get<RestResponse<DataListResponse<RateValueDto>>>(
      `${this.api}/values`,
      { workerId: workerId }
    );
  }

  getWorkerAssignedRateValues(
    workerId: number
  ): Observable<RestResponse<RateValueNamesDto[]>> {
    return this._get<RestResponse<RateValueNamesDto[]>>(
      `${this.userApi}/assigned`,
      {
        workerId: workerId,
      }
    );
  }

  getRateValue(rateValueId: number): Observable<RestResponse<RateValueDto>> {
    return this._get<RestResponse<RateValueDto>>(
      `${this.api}/values/${rateValueId}`
    );
  }

  createRateValue(
    rateValue: Partial<RateValue>
  ): Observable<RestResponse<string>> {
    return this.http
      .post<RestResponse<string>>(`${this.api}/values`, rateValue)
      .pipe(catchError(this.handleError));
  }

  updateRateValue(
    rateValueId: number,
    rateValue: Partial<RateValue>
  ): Observable<RestResponse<string>> {
    return this.http
      .put<RestResponse<string>>(`${this.api}/values/${rateValueId}`, rateValue)
      .pipe(catchError(this.handleError));
  }

  deleteRateValue(itemId: number): Observable<RestResponse<void | string>> {
    return this.http
      .delete<RestResponse<void | string>>(`${this.api}/values/${itemId}`)
      .pipe(catchError(this.handleError));
  }
}
