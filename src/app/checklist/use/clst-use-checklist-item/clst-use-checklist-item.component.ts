import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
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
  @Input() sectionIndex: number;
  @Input() hasItemTags: boolean;

  public checklistTags: IChecklistItemTag[];
  public isPreview: boolean;
  public displayHtml: SafeHtml;

  constructor(
    private _dataPersistence: DataPersistenceService,
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(this.itemData.flexibleText);
    this.checklistTags = this._dataPersistence.getChecklistTags();
    this.isPreview = this._route.snapshot.url[0].path === "share" || null;
  }

  public onClick(): void {
    if (!this.isPreview) {
      this.itemForm.patchValue({
        checked: !this.itemForm.controls.checked.value
      });
    }
  }

  public onLabelClick(): void {
    event.stopPropagation();
  }
}
