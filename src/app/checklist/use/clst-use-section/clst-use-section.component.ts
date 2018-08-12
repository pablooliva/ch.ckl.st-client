import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";

import { ISection } from "../../../shared/data-persistence.service";

@Component({
  selector: "clst-use-section",
  templateUrl: "./clst-use-section.component.html",
  styleUrls: ["./clst-use-section.component.scss"]
})
export class ClstUseSectionComponent implements OnInit {
  @Input() sectionForm: FormGroup;
  @Input() sectionData: ISection;

  public get items(): FormArray {
    return this.sectionForm.get("checklistItems") as FormArray;
  }

  constructor() {}

  public ngOnInit(): void {}

  public getItem(idx: number): FormGroup {
    return <FormGroup>this.items.get([idx]);
  }
}
