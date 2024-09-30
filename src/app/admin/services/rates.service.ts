import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { Rate, RateType, RateValue } from "../models/rate";
import { DataListResponse } from "../../models/data-list-response";
import { catchError, Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";

@Injectable({
  providedIn: "root",
})
export class RatesService extends CrudService<Rate> {
  
  constructor() {
    super();
    this.api = "/api/admin/workers/rates";
  }

  getRateTypes(): Observable<RestResponse<DataListResponse<RateType>>> {
    return this._get<RestResponse<DataListResponse<RateType>>>(
      `${this.api}/types`,
    );
  }

  getWorkerRates(
    workerId: number,
  ): Observable<RestResponse<DataListResponse<RateValue>>> {
    return this._get<RestResponse<DataListResponse<RateValue>>>(
      `${this.api}/values`,
      { workerId: workerId },
    );
  }

  deleteRateValue(itemId: number): Observable<RestResponse<void | string>> {
    return this.http
      .delete<RestResponse<void | string>>(`${this.api}/values/${itemId}`)
      .pipe(
        catchError(this.handleError),
      );
  }

  createRateValue(rateValue: Partial<RateValue>): Observable<RestResponse<string>> {
    return this.http.post<RestResponse<string>>(`${this.api}/values`, rateValue)
    .pipe(
      catchError(this.handleError),
    )
  }

  updateRateValue(rateValueId: number, rateValue: Partial<RateValue>): Observable<RestResponse<string>> {
    return this.http.put<RestResponse<string>>(`${this.api}/values/${rateValueId}`, rateValue)
    .pipe(
      catchError(this.handleError),
    )
  }
}
