import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstFormComponent } from './clst-form.component';

describe('ClstFormComponent', () => {
  let component: ClstFormComponent;
  let fixture: ComponentFixture<ClstFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should clst-create', () => {
    expect(component).toBeTruthy();
  });
});
