import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "clst-checklist-item",
  templateUrl: "./clst-checklist-item.component.html",
  styleUrls: ["./clst-checklist-item.component.scss"]
})
export class ClstChecklistItemComponent implements OnInit {
  @Input() public checklistItem: FormGroup;

  constructor() {}

  public ngOnInit(): void {
    console.warn("checklistItem", this.checklistItem);
  }
}
