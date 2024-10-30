import { TestBed } from '@angular/core/testing';

import { WorkerDaysService } from './worker-days.service';

describe('WorkerDaysService', () => {
  let service: WorkerDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
