import { TestBed, inject } from '@angular/core/testing';

import { EmailRegistrationService } from './email-registration.service';

describe('EmailRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailRegistrationService]
    });
  });

  it('should be created', inject([EmailRegistrationService], (service: EmailRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
