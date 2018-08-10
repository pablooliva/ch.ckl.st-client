import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstUseRootComponent } from './clst-use-root.component';

describe('ClstChecklistUseComponent', () => {
  let component: ClstUseRootComponent;
  let fixture: ComponentFixture<ClstUseRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstUseRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstUseRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
