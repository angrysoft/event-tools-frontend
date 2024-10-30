import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuActionComponent } from './menu-action.component';

describe('MenuActionComponent', () => {
  let component: MenuActionComponent;
  let fixture: ComponentFixture<MenuActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
