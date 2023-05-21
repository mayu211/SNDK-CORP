import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangePopupComponent } from './password-change-popup.component';

describe('PasswordChangePopupComponent', () => {
  let component: PasswordChangePopupComponent;
  let fixture: ComponentFixture<PasswordChangePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordChangePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordChangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
