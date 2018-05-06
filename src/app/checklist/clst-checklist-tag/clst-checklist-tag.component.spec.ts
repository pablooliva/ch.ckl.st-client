import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstChecklistTagComponent } from './clst-checklist-tag.component';

describe('ClstChecklistTagComponent', () => {
  let component: ClstChecklistTagComponent;
  let fixture: ComponentFixture<ClstChecklistTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstChecklistTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstChecklistTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
