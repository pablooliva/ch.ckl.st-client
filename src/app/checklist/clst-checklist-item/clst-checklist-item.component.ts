import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

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
  public tagsEnabled: AbstractControl;

  constructor(private _fEPusherService: FormElementPusherService) {}

  public ngOnInit(): void {
    this.addTag = false;
    this.tagsEnabled = this.checklistItem.controls.checklistTagsEnabled;
  }

  public addItem(index: number): void {
    this._fEPusherService.pushFormElement({
      type: pushFEType.Item,
      group: this.checklistItem,
      index: index
    });
  }
}
