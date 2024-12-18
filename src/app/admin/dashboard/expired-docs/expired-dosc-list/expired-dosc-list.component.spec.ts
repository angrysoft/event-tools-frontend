import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredDoscListComponent } from './expired-dosc-list.component';

describe('ExpiredDoscListComponent', () => {
  let component: ExpiredDoscListComponent;
  let fixture: ComponentFixture<ExpiredDoscListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredDoscListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredDoscListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
