import { TestBed, inject } from '@angular/core/testing';

import { DocTagService } from './doc-tag.service';

describe('DocTagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocTagService]
    });
  });

  it('should be created', inject([DocTagService], (service: DocTagService) => {
    expect(service).toBeTruthy();
  }));
});
