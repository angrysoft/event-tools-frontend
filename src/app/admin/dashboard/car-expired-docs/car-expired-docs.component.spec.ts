import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarExpiredDocsComponent } from './car-expired-docs.component';

describe('CarExpiredDocsComponent', () => {
  let component: CarExpiredDocsComponent;
  let fixture: ComponentFixture<CarExpiredDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarExpiredDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarExpiredDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
