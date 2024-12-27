import { TestBed } from '@angular/core/testing';

import { CrudService } from './crud.service';

describe('CrudService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: CrudService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
