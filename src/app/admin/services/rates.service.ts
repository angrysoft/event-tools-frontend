import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { Rate, RateType } from '../models/rate';
import { DataListResponse } from '../../models/data-list-response';
import { Observable } from 'rxjs';
import { RestResponse } from '../../models/rest-response';

@Injectable({
  providedIn: 'root'
})
export class RatesService extends CrudService<Rate> {

  constructor() {
    super();
    this.api = "/api/admin/workers/rates";
  }

  getRateTypes():Observable<RestResponse<DataListResponse<RateType>>> {
    return this._get<RestResponse<DataListResponse<RateType>>>(`${this.api}/types`);
  }
}
