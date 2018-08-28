import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstUseAnonComponent } from './clst-use-anon.component';

describe('ClstUseAnonComponent', () => {
  let component: ClstUseAnonComponent;
  let fixture: ComponentFixture<ClstUseAnonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstUseAnonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstUseAnonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
