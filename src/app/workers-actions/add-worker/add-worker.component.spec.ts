import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerComponent } from './add-worker.component';

describe('AddWorkerComponent', () => {
  let component: AddWorkerComponent;
  let fixture: ComponentFixture<AddWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
