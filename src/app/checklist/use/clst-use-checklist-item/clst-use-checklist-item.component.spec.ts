import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstUseChecklistItemComponent } from './clst-use-checklist-item.component';

describe('ClstUseChecklistItemComponent', () => {
  let component: ClstUseChecklistItemComponent;
  let fixture: ComponentFixture<ClstUseChecklistItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstUseChecklistItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstUseChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
