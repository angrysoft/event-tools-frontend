import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCommentComponent } from './change-comment.component';

describe('ChangeCommentComponent', () => {
  let component: ChangeCommentComponent;
  let fixture: ComponentFixture<ChangeCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
