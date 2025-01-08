import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredCarDocsListComponent } from './expired-car-docs-list.component';

describe('ExpiredCarDocsListComponent', () => {
  let component: ExpiredCarDocsListComponent;
  let fixture: ComponentFixture<ExpiredCarDocsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredCarDocsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredCarDocsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
