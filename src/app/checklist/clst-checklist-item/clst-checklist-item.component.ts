import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs/operators";

import {
  FormElementPusherService,
  pushFEType
} from "../../shared/form-element-pusher.service";
import { ChecklistItemTagsSyncService } from "../../shared/checklist-item-tags-sync.service";
import { genericValidationTest } from "../../shared/clst-utils";

@Component({
  selector: "clst-checklist-item",
  templateUrl: "./clst-checklist-item.component.html",
  styleUrls: ["./clst-checklist-item.component.scss"]
})
export class ClstChecklistItemComponent implements OnInit, OnDestroy {
  @Input() public checklistItem: FormGroup;
  @Input() public checklistItemIndex: number;

  public addTag: boolean;
  public tags: any[];

  public get checklistTagsEnabled(): FormArray {
    return this.checklistItem.get("checklistTagsEnabled") as FormArray;
  }

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _fb: FormBuilder,
    private _fEPusherService: FormElementPusherService,
    private _syncTags: ChecklistItemTagsSyncService
  ) {}

  public ngOnInit(): void {
    this.addTag = false;

    this._syncTags
      .observeTags()
      .pipe(takeUntil(this._destroy$))
      .subscribe(tags => {
        this.tags = tags;
        const valLength = this.checklistTagsEnabled.controls.length;
        this.tags.forEach((t, i) => {
          if (i >= valLength) {
            this.checklistTagsEnabled.push(
              this._fb.group({
                tag: false
              })
            );
          }
        });
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.checklistItem, formField, "required");
  }

  public addItem(index: number): void {
    this._fEPusherService.pushFormElement({
      type: pushFEType.Item,
      group: this.checklistItem,
      index: index
    });
  }

  public removeItem(index: number): void {
    // TODO: implement...
  }
}
