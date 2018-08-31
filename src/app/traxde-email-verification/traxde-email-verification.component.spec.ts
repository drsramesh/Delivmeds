import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraxdeEmailVerificationComponent } from './traxde-email-verification.component';

describe('TraxdeEmailVerificationComponent', () => {
  let component: TraxdeEmailVerificationComponent;
  let fixture: ComponentFixture<TraxdeEmailVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraxdeEmailVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraxdeEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
