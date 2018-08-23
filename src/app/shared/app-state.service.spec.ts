import { TestBed, inject } from '@angular/core/testing';

import { RedirectionService } from './app-state.service';

describe('RedirectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectionService]
    });
  });

  it('should be created', inject([RedirectionService], (service: RedirectionService) => {
    expect(service).toBeTruthy();
  }));
});
