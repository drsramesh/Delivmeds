import { TestBed, inject } from '@angular/core/testing';

import { AuthLoginGuardService } from './auth-login-guard.service';

describe('AuthLoginGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthLoginGuardService]
    });
  });

  it('should be created', inject([AuthLoginGuardService], (service: AuthLoginGuardService) => {
    expect(service).toBeTruthy();
  }));
});
