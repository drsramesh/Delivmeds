import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotAsswordComponent } from './forgot-assword.component';

describe('ForgotAsswordComponent', () => {
  let component: ForgotAsswordComponent;
  let fixture: ComponentFixture<ForgotAsswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotAsswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotAsswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
