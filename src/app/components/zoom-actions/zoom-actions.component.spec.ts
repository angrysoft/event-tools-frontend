import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomActionsComponent } from './zoom-actions.component';

describe('ZoomActionsComponent', () => {
  let component: ZoomActionsComponent;
  let fixture: ComponentFixture<ZoomActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoomActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
