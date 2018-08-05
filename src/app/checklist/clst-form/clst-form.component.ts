import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
  FormElementPusherService,
  IPushFormElement
} from "../../shared/form-element-pusher.service";
import { ServerConnectService } from "../../shared/server-connect.service";
import {
  DataPersistenceService,
  INgxChips
} from "../../shared/data-persistence.service";
import { genericValidationTest } from "../../shared/clst-utils";
import { DocTagService } from "../../shared/doc-tag.service";

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
  public buttonReset: Subject<boolean> = new Subject<boolean>();
  public validators = [this._notDuplicate.bind(this)];

  public get sections(): FormArray {
    return this.clForm.get("sections") as FormArray;
  }

  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _http: HttpClient,
    private _fEPusherService: FormElementPusherService,
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _docTagService: DocTagService
  ) {}

  ngOnInit() {
    this._fEPusherService.formElement
      .pipe(takeUntil(this._destroy))
      .subscribe((newElem: IPushFormElement) => {
        switch (newElem.type) {
          case "section":
            this._newSection(newElem.index, null, newElem.group);
            break;
          case "item":
            this._newChecklistItem(newElem.index, null, newElem.group);
            break;
          default:
            console.error("This form element does not exist.");
        }
      });

    this._initForm();
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public onTagAdd(tag: INgxChips): any {
    this._docTagService.getId(tag).then((result: INgxChips) => {
      this._handleTagAdd.call(this, result);
    });
  }

  private _handleTagAdd(result: INgxChips): void {
    const docTags: Object[] = this.clForm.get("documentTags").value;
    docTags.forEach((tag: INgxChips) => {
      if (tag.display.toLowerCase() === result.display) {
        tag.display = result.display;
        tag.value = result.value;
      }
    });
    this.clForm.patchValue({ documentTags: docTags });
  }

  private _notDuplicate(control: FormControl) {
    const displayVals: string[] = this.clForm
      .get("documentTags")
      .value.map(tags => tags.display);
    if (displayVals.find(val => val === control.value)) {
      return { duplicate: true };
    } else {
      return null;
    }
  }

  public reset(): Observable<boolean> {
    return this.buttonReset;
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
        JSON.stringify(this._dataPersistence.prepareDBData(this.clForm.value)),
        httpOptions
      )
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          this._toastr.success(val.uiMessage, val.type);
          this.buttonReset.next(true);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
          this.buttonReset.next(true);
        }
      );
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.clForm, formField, "required");
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
    // TODO: if loading a saved checklist, set checklistID
    const checklistId = null;
    const data = this._dataPersistence.prepareClientData(checklistId);
    const sectionControls = data.sections.map(
      section => new FormControl(section)
    );

    this.clForm = this._fb.group({
      public: data.public,
      documentTitle: [data.documentTitle, Validators.required],
      documentTags: [data.documentTags],
      customCss: data.customCss,
      sections: this._fb.array(sectionControls)
    });

    this._newSection(0, this.sections);
  }

  /***
   * These _new* functions can be called either by an array reference,
   * which is an external pointer,
   * or by an internal "self/this" reference via the group reference
   ***/

  private _newSection(idx: number, array: FormArray, group?: FormGroup): void {
    const section = this._fb.group({
      title: "",
      flexibleText: "",
      checklistItems: this._fb.array([])
    });

    const arrayRef = this._handleInsert(section, idx, array, group);
    this._newChecklistItem(0, arrayRef);
  }

  private _newChecklistItem(
    idx: number,
    parentArray: IParentArray,
    group?: FormGroup
  ): void {
    const item = this._fb.group({
      label: ["", Validators.required],
      flexibleText: "",
      checklistTagsEnabled: this._fb.array([])
    });

    const array = group
      ? null
      : parentArray.array.controls[parentArray.index].get("checklistItems");

    this._handleInsert(item, idx, <FormArray>array, group);
  }
}
