import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstUseComponent } from './clst-use.component';

describe('ClstUseComponent', () => {
  let component: ClstUseComponent;
  let fixture: ComponentFixture<ClstUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
