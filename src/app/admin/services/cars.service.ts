import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { Car } from "../../models/car";

@Injectable({
  providedIn: "root",
})
export class CarsService extends CrudService<Car> {
  getWorkerCars(
    workerId: number
  ): Observable<RestResponse<DataListResponse<Car>>> {
    return this._get<RestResponse<DataListResponse<Car>>>(
      `${this.api}/driver/${workerId}`
    );
  }

  constructor() {
    super();
    this.api = "/api/admin/workers/cars";
  }
}
