import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { RestResponse } from '../models/rest-response';

@Injectable({
  providedIn: 'root'
})
export class UtilsService extends CrudService<string> {
  getVersions() {
    return this._get<RestResponse<string>>("/api/app/version");
  }
}
