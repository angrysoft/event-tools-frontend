import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { Addon, AddonType } from '../models/addon';
import { Observable } from 'rxjs';
import { DataListResponse } from '../../models/data-list-response';
import { RestResponse } from '../../models/rest-response';

@Injectable({
  providedIn: 'root'
})
export class AddonsService extends CrudService<Addon> {

  constructor() {
    super();
    this.api = "/api/admin/workers/addons"
  }

  getAddonsTypes(): Observable<RestResponse<DataListResponse<AddonType>>> {
    return this._get<RestResponse<DataListResponse<AddonType>>>(
      `${this.api}/types`,
    );
  }
}
