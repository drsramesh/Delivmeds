import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEmailVerificationComponent } from './member-email-verification.component';

describe('MemberEmailVerificationComponent', () => {
  let component: MemberEmailVerificationComponent;
  let fixture: ComponentFixture<MemberEmailVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberEmailVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
