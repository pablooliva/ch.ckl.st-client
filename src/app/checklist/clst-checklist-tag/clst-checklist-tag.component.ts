import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "clst-checklist-tag",
  templateUrl: "./clst-checklist-tag.component.html",
  styleUrls: ["./clst-checklist-tag.component.scss"]
})
export class ClstChecklistTagComponent implements OnInit {
  @Input() public tag: FormGroup;

  constructor() {}

  public ngOnInit(): void {
    console.warn("tag", this.tag);
  }
}
