import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstSectionComponent } from './clst-section.component';

describe('ClstSectionComponent', () => {
  let component: ClstSectionComponent;
  let fixture: ComponentFixture<ClstSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
