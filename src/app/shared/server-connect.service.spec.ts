import { TestBed, inject } from '@angular/core/testing';

import { ServerConnectService } from './server-connect.service';

describe('ServerConnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerConnectService]
    });
  });

  it('should be created', inject([ServerConnectService], (service: ServerConnectService) => {
    expect(service).toBeTruthy();
  }));
});
