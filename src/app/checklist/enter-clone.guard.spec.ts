import { TestBed, async, inject } from '@angular/core/testing';

import { EnterCloneGuard } from './enter-clone.guard';

describe('EnterCloneGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnterCloneGuard]
    });
  });

  it('should ...', inject([EnterCloneGuard], (guard: EnterCloneGuard) => {
    expect(guard).toBeTruthy();
  }));
});
