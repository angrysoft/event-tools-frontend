import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkerComponent } from './edit-worker.component';

describe('EditWorkerComponent', () => {
  let component: EditWorkerComponent;
  let fixture: ComponentFixture<EditWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
