import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstTagDisplayComponent } from './clst-tag-display.component';

describe('ClstTagDisplayComponent', () => {
  let component: ClstTagDisplayComponent;
  let fixture: ComponentFixture<ClstTagDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstTagDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstTagDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
