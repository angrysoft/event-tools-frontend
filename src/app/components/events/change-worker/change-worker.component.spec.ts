import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWorkerComponent } from './change-worker.component';

describe('ChangeWorkerComponent', () => {
  let component: ChangeWorkerComponent;
  let fixture: ComponentFixture<ChangeWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
