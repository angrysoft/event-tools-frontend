import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInfoComponent } from './change-info.component';

describe('ChangeInfoComponent', () => {
  let component: ChangeInfoComponent;
  let fixture: ComponentFixture<ChangeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
