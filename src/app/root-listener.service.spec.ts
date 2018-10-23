import { TestBed } from '@angular/core/testing';

import { RootListenerService } from './root-listener.service';

describe('RootListenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RootListenerService = TestBed.get(RootListenerService);
    expect(service).toBeTruthy();
  });
});
