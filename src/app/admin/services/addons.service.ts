import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import {
  Addon,
  AddonType,
  AddonValue,
  AddonValueDto,
} from "../../models/addon";
import { catchError, Observable } from "rxjs";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";

@Injectable({
  providedIn: "root",
})
export class AddonsService extends CrudService<Addon> {
  constructor() {
    super();
    this.api = "/api/admin/workers/addons";
  }

  getAddonsTypes(): Observable<RestResponse<DataListResponse<AddonType>>> {
    return this._get<RestResponse<DataListResponse<AddonType>>>(
      `${this.api}/types`
    );
  }

  getWorkerAddons(
    workerId: number
  ): Observable<RestResponse<DataListResponse<AddonValueDto>>> {
    return this._get<RestResponse<DataListResponse<AddonValueDto>>>(
      `${this.api}/values`,
      { workerId: workerId }
    );
  }

  getAddonValue(addonValueId: number): Observable<RestResponse<AddonValueDto>> {
    return this._get<RestResponse<AddonValueDto>>(
      `${this.api}/values/${addonValueId}`
    );
  }

  createAddonValue(
    addonValue: Partial<AddonValue>
  ): Observable<RestResponse<string>> {
    return this.http
      .post<RestResponse<string>>(`${this.api}/values`, addonValue)
      .pipe(catchError(this.handleError));
  }

  updateAddonValue(
    addonValueId: number,
    addonValue: Partial<AddonValue>
  ): Observable<RestResponse<string>> {
    return this.http
      .put<RestResponse<string>>(
        `${this.api}/values/${addonValueId}`,
        addonValue
      )
      .pipe(catchError(this.handleError));
  }

  deleteAddonValue(itemId: number): Observable<RestResponse<void | string>> {
    return this.http
      .delete<RestResponse<void | string>>(`${this.api}/values/${itemId}`)
      .pipe(catchError(this.handleError));
  }
}
