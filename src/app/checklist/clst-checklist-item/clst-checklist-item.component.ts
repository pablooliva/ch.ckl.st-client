import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import {
  FormElementPusherService,
  pushFEType
} from "../form-element-pusher.service";

@Component({
  selector: "clst-checklist-item",
  templateUrl: "./clst-checklist-item.component.html",
  styleUrls: ["./clst-checklist-item.component.scss"]
})
export class ClstChecklistItemComponent implements OnInit {
  @Input() public checklistItem: FormGroup;
  @Input() public checklistItemIndex: number;

  public addTag: boolean;

  constructor(private _fEPusherService: FormElementPusherService) {}

  public ngOnInit(): void {
    console.warn("checklistItem", this.checklistItem);
    this.addTag = false;
  }

  public addItem(index: number): void {
    this._fEPusherService.pushFormElement({
      type: pushFEType.Item,
      group: this.checklistItem,
      index: index
    });
  }
}
