import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredDocsComponent } from './expired-docs.component';

describe('ExpiredDocsComponent', () => {
  let component: ExpiredDocsComponent;
  let fixture: ComponentFixture<ExpiredDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
