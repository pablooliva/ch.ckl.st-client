import { TestBed, inject } from '@angular/core/testing';

import { ChecklistItemTagsSyncService } from './checklist-item-tags-sync.service';

describe('ChecklistItemTagsSyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChecklistItemTagsSyncService]
    });
  });

  it('should be created', inject([ChecklistItemTagsSyncService], (service: ChecklistItemTagsSyncService) => {
    expect(service).toBeTruthy();
  }));
});
