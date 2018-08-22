import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstSharePreviewComponent } from './clst-share-preview.component';

describe('ClstSharePreviewComponent', () => {
  let component: ClstSharePreviewComponent;
  let fixture: ComponentFixture<ClstSharePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClstSharePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstSharePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
