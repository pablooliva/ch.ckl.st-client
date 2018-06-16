import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstChecklistTagEditComponent } from './clst-checklist-tag.component';

describe('ClstChecklistItemTagEditComponent', () => {
  let component: ClstChecklistTagEditComponent;
  let fixture: ComponentFixture<ClstChecklistTagEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstChecklistTagEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstChecklistTagEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
