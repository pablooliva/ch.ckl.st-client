import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstCloneComponent } from './clst-clone.component';

describe('ClstCloneComponent', () => {
  let component: ClstCloneComponent;
  let fixture: ComponentFixture<ClstCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
