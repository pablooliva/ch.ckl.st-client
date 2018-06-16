import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstChecklistItemTagsComponent } from './clst-checklist-item-tags.component';

describe('ClstChecklistItemTagsComponent', () => {
  let component: ClstChecklistItemTagsComponent;
  let fixture: ComponentFixture<ClstChecklistItemTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstChecklistItemTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstChecklistItemTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
