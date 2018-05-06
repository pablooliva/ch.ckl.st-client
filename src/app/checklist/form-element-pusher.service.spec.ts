import { TestBed, inject } from '@angular/core/testing';

import { FormElementPusherService } from './form-element-pusher.service';

describe('FormElementPusherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormElementPusherService]
    });
  });

  it('should be created', inject([FormElementPusherService], (service: FormElementPusherService) => {
    expect(service).toBeTruthy();
  }));
});
