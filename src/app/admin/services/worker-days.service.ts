import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { WorkerDay } from '../models/events';

@Injectable({
  providedIn: 'root'
})
export class WorkerDaysService extends CrudService<WorkerDay> {

  constructor() {
    super();
    this.api = "/api/admin/events"
  }
  
}
