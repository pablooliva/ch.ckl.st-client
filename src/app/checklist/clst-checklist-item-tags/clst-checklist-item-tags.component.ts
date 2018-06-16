import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs/operators";

import {
  ChecklistItemTagsSyncService,
  IChecklistItemTag
} from "../../shared/checklist-item-tags-sync.service";

export interface ITagsCheckmarked extends IChecklistItemTag {
  checked: boolean;
}

@Component({
  selector: "clst-checklist-item-tags",
  templateUrl: "./clst-checklist-item-tags.component.html",
  styleUrls: ["./clst-checklist-item-tags.component.scss"]
})
export class ClstChecklistItemTagsComponent implements OnInit, OnDestroy {
  @Input() public tagsEnabled: AbstractControl;

  public tags: IChecklistItemTag[];

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _syncTags: ChecklistItemTagsSyncService) {}

  public ngOnInit(): void {
    this._syncTags
      .observeTags()
      .pipe(takeUntil(this._destroy$))
      .subscribe(tags => {
        this.tags = this._setCheckmarks(tags, this.tagsEnabled.value);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  private _setCheckmarks(
    tags: IChecklistItemTag[],
    tagsEnabled: string[]
  ): ITagsCheckmarked[] {
    return <any>tags.map(tag => {
      tag["checked"] = tagsEnabled ? tagsEnabled.includes(tag.label) : false;
      return tag;
    });
  }
}
