import { TestBed, inject } from '@angular/core/testing';

import { DelivMedsAuthService } from './deliv-meds-auth.service';

describe('DelivMedsAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DelivMedsAuthService]
    });
  });

  it('should be created', inject([DelivMedsAuthService], (service: DelivMedsAuthService) => {
    expect(service).toBeTruthy();
  }));
});
