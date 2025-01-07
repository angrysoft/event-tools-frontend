import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDocsComponent } from './car-docs.component';

describe('CarDocsComponent', () => {
  let component: CarDocsComponent;
  let fixture: ComponentFixture<CarDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
