import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";

import { FormElementPusherService } from "../../shared/form-element-pusher.service";

@Component({
  selector: "clst-section",
  templateUrl: "./clst-section.component.html",
  styleUrls: ["./clst-section.component.scss"]
})
export class ClstSectionComponent implements OnInit {
  @Input() public section: FormGroup;
  @Input() public sectionIndex: number;
  @Input() public formGroup: FormGroup;

  constructor(private _fEPusherService: FormElementPusherService) {}

  public ngOnInit(): void {}

  // index tracks current or next index to add/push to
  public addSection(index: number): void {
    this._fEPusherService.pushFormElement({
      type: "section",
      group: this.section,
      index: index
    });
  }

  public removeSection(index: number): void {
    (<FormArray>this.formGroup.controls["sections"]).removeAt(index);
    if (!(<FormArray>this.formGroup.controls["sections"]).length) {
      this.addSection(0);
    }
  }
}
