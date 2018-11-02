import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClstFlexTextComponent } from "./clst-flex-text.component";

describe("ClstFlexTextComponent", () => {
  let component: ClstFlexTextComponent;
  let fixture: ComponentFixture<ClstFlexTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClstFlexTextComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstFlexTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
