import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmailVerificationComponent } from './customer-email-verification.component';

describe('CustomerEmailVerificationComponent', () => {
  let component: CustomerEmailVerificationComponent;
  let fixture: ComponentFixture<CustomerEmailVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEmailVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
