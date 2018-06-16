import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs/operators";

import {
  FormElementPusherService,
  IPushFormElement,
  pushFEType
} from "../form-element-pusher.service";
import { ServerConnectService } from "../../shared/server-connect.service";
import { DataPersistence } from "../../shared/data-persistence.service";
import { ChecklistItemTagsSyncService } from "../../shared/checklist-item-tags-sync.service";

interface IParentArray {
  array: FormArray;
  index: number;
}

@Component({
  selector: "clst-form",
  templateUrl: "./clst-form.component.html",
  styleUrls: ["./clst-form.component.scss"]
})
export class ClstFormComponent implements OnInit, OnDestroy {
  public clForm: FormGroup;

  public get sections(): FormArray {
    return this.clForm.get("sections") as FormArray;
  }

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _http: HttpClient,
    private _fEPusherService: FormElementPusherService,
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistence,
    private _clistItemTagsSyncService: ChecklistItemTagsSyncService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this._fEPusherService.formElement
      .pipe(takeUntil(this._destroy$))
      .subscribe((newElem: IPushFormElement) => {
        switch (newElem.type) {
          case pushFEType.Section:
            this._newSection(newElem.index, null, newElem.group);
            break;
          case pushFEType.Item:
            this._newChecklistItem(newElem.index, null, newElem.group);
            break;
          default:
            console.error("This form element does not exist.");
        }
      });

    this._initForm();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public onSubmit(): void {
    const checklistPath = "checklists";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    this._serverConnectService
      .postChecklist(
        checklistPath,
        JSON.stringify(this._dataPersistence.prepareData(this.clForm.value)),
        httpOptions
      )
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        val => console.warn("success", val),
        error => console.error("error", error)
      );
  }

  private _handleInsert(
    insertGroup: FormGroup,
    index: number,
    array?: FormArray,
    currentGroup?: FormGroup
  ): IParentArray {
    const fbArray = array || <FormArray>currentGroup.parent;

    if (index === fbArray.length) {
      fbArray.push(insertGroup);
    } else {
      fbArray.insert(index, insertGroup);
    }

    return { array: fbArray, index: index };
  }

  private _initForm(): void {
    this.clForm = this.fb.group({
      /*parentChecklist: "",*/
      public: false,
      documentTitle: "",
      documentTags: [[]],
      checklistTags: [[]],
      customCss: "",
      sections: this.fb.array([])
    });

    this._newSection(0, this.sections);

    this._clistItemTagsSyncService
      .observeTags()
      .pipe(takeUntil(this._destroy$))
      .subscribe(tags => {
        this.clForm.patchValue({ checklistTags: tags });
      });
  }

  /***
   * These _new* functions can be called either by an array reference,
   * which is an external pointer,
   * or by an internal "self/this" reference via the group reference
   ***/

  private _newSection(idx: number, array: FormArray, group?: FormGroup): void {
    const section = this.fb.group({
      title: "",
      flexibleText: "",
      checklistItems: this.fb.array([])
    });

    const arrayRef = this._handleInsert(section, idx, array, group);
    this._newChecklistItem(0, arrayRef);
  }

  private _newChecklistItem(
    idx: number,
    parentArray: IParentArray,
    group?: FormGroup
  ): void {
    const item = this.fb.group({
      label: "",
      flexibleText: "",
      checklistTagsEnabled: []
    });

    const array = group
      ? null
      : parentArray.array.controls[parentArray.index].get("checklistItems");

    this._handleInsert(item, idx, <FormArray>array, group);
  }
}
