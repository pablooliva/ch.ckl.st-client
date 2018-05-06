import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstChecklistItemComponent } from './clst-checklist-item.component';

describe('ClstChecklistItemComponent', () => {
  let component: ClstChecklistItemComponent;
  let fixture: ComponentFixture<ClstChecklistItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstChecklistItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
