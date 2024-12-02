import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveWorkerDayComponent } from './remove-worker-day.component';

describe('RemoveWorkerDayComponent', () => {
  let component: RemoveWorkerDayComponent;
  let fixture: ComponentFixture<RemoveWorkerDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveWorkerDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveWorkerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
