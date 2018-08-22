import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

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
  @Input() itemForm: FormGroup;
  @Input() itemData: IChecklistItem;
  @Input() itemIndex: number;

  public checklistTags: IChecklistItemTag[];
  public isPreview: boolean;

  constructor(
    private _dataPersistence: DataPersistenceService,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.checklistTags = this._dataPersistence.getChecklistTags();
    this.isPreview = this._route.snapshot.url[0].path === "share" || null;
  }
}
