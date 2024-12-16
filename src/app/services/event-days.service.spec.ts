import { TestBed } from "@angular/core/testing";

import { EventDaysService } from "./event-days.service";

describe("EventDaysService", () => {
  let service: EventDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDaysService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
