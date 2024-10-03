import { TestBed } from '@angular/core/testing';

import { AddonsService } from './addons.service';

describe('AddonsService', () => {
  let service: AddonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
