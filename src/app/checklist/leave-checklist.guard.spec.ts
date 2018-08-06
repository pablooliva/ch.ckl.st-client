import { TestBed, async, inject } from '@angular/core/testing';

import { LeaveChecklistGuard } from './leave-checklist.guard';

describe('LeaveChecklistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveChecklistGuard]
    });
  });

  it('should ...', inject([LeaveChecklistGuard], (guard: LeaveChecklistGuard) => {
    expect(guard).toBeTruthy();
  }));
});
