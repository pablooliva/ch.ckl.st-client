import { Component, Input, OnInit } from "@angular/core";

import {
  DataPersistenceService,
  IChecklistItem,
  IChecklistItemTag
} from "../../../shared/data-persistence.service";

@Component({
  selector: "clst-use-checklist-item",
  templateUrl: "./clst-use-checklist-item.component.html",
  styleUrls: ["./clst-use-checklist-item.component.scss"]
})
export class ClstUseChecklistItemComponent implements OnInit {
  @Input() item: IChecklistItem;

  public checklistTags: IChecklistItemTag[];

  constructor(private _dataPersistence: DataPersistenceService) {}

  public ngOnInit(): void {
    this.checklistTags = this._dataPersistence.getChecklistTags();
  }
}
