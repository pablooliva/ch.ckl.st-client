import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClstRedirectionComponent } from "./redirection.component";

describe("RedirectionComponent", () => {
  let component: ClstRedirectionComponent;
  let fixture: ComponentFixture<ClstRedirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClstRedirectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
