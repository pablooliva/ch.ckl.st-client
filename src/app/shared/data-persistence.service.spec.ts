import { TestBed, inject } from '@angular/core/testing';

import { DataPersistence.ServiceService } from './data-persistence.service.service';

describe('DataPersistenceService.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataPersistence.ServiceService]
    });
  });

  it('should be created', inject([DataPersistence.ServiceService], (service: DataPersistence.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
