import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClstChecklistItemTagEditComponent } from "./clst-checklist-item-tag-edit.component";

describe("ClstChecklistItemTagEditComponent", () => {
  let component: ClstChecklistItemTagEditComponent;
  let fixture: ComponentFixture<ClstChecklistItemTagEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClstChecklistItemTagEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstChecklistItemTagEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
