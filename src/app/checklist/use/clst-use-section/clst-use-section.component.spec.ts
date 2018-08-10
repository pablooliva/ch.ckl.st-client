import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstUseSectionComponent } from './clst-use-section.component';

describe('ClstUseSectionComponent', () => {
  let component: ClstUseSectionComponent;
  let fixture: ComponentFixture<ClstUseSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstUseSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstUseSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
