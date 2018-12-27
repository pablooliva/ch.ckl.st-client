import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
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
  @Input() sectionIndex: number;
  @Input() hasItemTags: boolean;

  public displayHtml: SafeHtml;

  public get items(): FormArray {
    return this.sectionForm.get("checklistItems") as FormArray;
  }

  constructor(private _sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    const regex = new RegExp(/<p><br><\/p>+$/);
    this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(
      this.sectionData.flexibleText.replace(regex, "")
    );
  }

  public getItem(idx: number): FormGroup {
    return <FormGroup>this.items.get([idx]);
  }
}
