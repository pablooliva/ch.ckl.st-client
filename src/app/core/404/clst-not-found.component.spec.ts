import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClstNotFoundComponent } from "./clst-not-found.component";

describe("ClstNotFoundComponent", () => {
  let component: ClstNotFoundComponent;
  let fixture: ComponentFixture<ClstNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClstNotFoundComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
