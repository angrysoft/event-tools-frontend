import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEventComponent } from './show-event.component';

describe('ShowEventComponent', () => {
  let component: ShowEventComponent;
  let fixture: ComponentFixture<ShowEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
