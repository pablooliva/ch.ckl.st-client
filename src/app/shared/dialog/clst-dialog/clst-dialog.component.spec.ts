import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClstDialogComponent } from "./clst-dialog.component";

describe("ClstDialogComponent", () => {
  let component: ClstDialogComponent;
  let fixture: ComponentFixture<ClstDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClstDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClstDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
