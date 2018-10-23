import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
  FormElementPusherService,
  IPushFormElement
} from "../../../shared/form-element-pusher.service";
import { ServerConnectService } from "../../../shared/server-connect.service";
import {
  DataPersistenceService,
  IClstFormDataModel,
  INgxChips
} from "../../../shared/data-persistence.service";
import { genericValidationTest } from "../../../shared/clst-utils";
import { DocTagService } from "../../../shared/doc-tag.service";
import { oneOfRequiredValidator } from "../clst-section/clst-section.component";
import { ClstBaseComponent } from "../../../shared/clst-base.component";
import { RootListenerService } from "../../../shared/root-listener.service";

interface IParentArray {
  array: FormArray;
  index: number;
}

@Component({
  selector: "clst-form",
  templateUrl: "./clst-form.component.html",
  styleUrls: ["./clst-form.component.scss"]
})
export class ClstFormComponent extends ClstBaseComponent
  implements OnInit, OnDestroy {
  @Input() cId: string;

  public clForm: FormGroup;
  public buttonReset: Subject<boolean> = new Subject<boolean>();
  public validators = [this._notDuplicate.bind(this)];
  public newClone: boolean;

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
    private _docTagService: DocTagService,
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.newClone = this._router.url === "/clone";

    this._fEPusherService.formElement
      .pipe(takeUntil(this._destroy))
      .subscribe((newElem: IPushFormElement) => {
        switch (newElem.type) {
          case "section":
            this._newSection(
              newElem.index,
              null,
              newElem.group,
              newElem.validator
            );
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
    super.ngOnDestroy();
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
      if (tag.display.toLowerCase() === result.display.toLowerCase()) {
        tag.display = result.display.toLowerCase();
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
          if (this.newClone || !this.cId) {
            this._router.navigate([
              "/checklist",
              val.serverResponse.checklistId
            ]);
          }
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

  public cloneChecklist(): void {
    this._dataPersistence.prepChecklistDataClone();
    this._router.navigate(["/clone"]);
  }

  public useChecklist(): void {
    this._router.navigate(["/use", this.cId]);
  }

  public shareChecklist(): void {
    this._router.navigate(["/share", this.cId]);
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
    this._dataPersistence
      .prepareClientData(this.cId, this._serverConnectService)
      .then((data: IClstFormDataModel) => {
        this.clForm = this._fb.group({
          public: data.public,
          documentTitle: [data.documentTitle, Validators.required],
          documentTags: [data.documentTags],
          customCss: data.customCss,
          sections: this._fb.array([])
        });

        if (data.sections.length) {
          data.sections.forEach(section => {
            const checklistItems = this._fb.array([]);

            section["checklistItems"].forEach(cItem => {
              const tagsEnabled = this._fb.array([]);

              cItem["checklistTagsEnabled"].forEach(tag => {
                tagsEnabled.push(this._fb.group({ tag: tag.tag }));
              });

              const newGroup = this._fb.group({
                label: [cItem.label, Validators.required],
                flexibleText: cItem.flexibleText,
                checked: cItem.checked,
                checklistTagsEnabled: tagsEnabled
              });
              checklistItems.push(newGroup);
            });

            const sectionGroup = this._fb.group(
              {
                title: <string>section["title"],
                flexibleText: <string>section["flexibleText"],
                checklistItems: checklistItems
              },
              { validator: oneOfRequiredValidator }
            );

            this.sections.push(sectionGroup);
          });
        } else {
          this._newSection(0, this.sections, null, oneOfRequiredValidator);
        }
      });
  }

  /***
   * These _new* functions can be called either by an array reference,
   * which is an external pointer,
   * or by an internal "self/this" reference via the group reference
   ***/

  private _newSection(
    idx: number,
    array: FormArray,
    group?: FormGroup,
    validator?: ValidatorFn
  ): void {
    const section = this._fb.group(
      {
        title: "",
        flexibleText: "",
        checklistItems: this._fb.array([])
      },
      { validator: validator }
    );

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
      checked: false,
      checklistTagsEnabled: this._fb.array([])
    });

    const array = group
      ? null
      : parentArray.array.controls[parentArray.index].get("checklistItems");

    this._handleInsert(item, idx, <FormArray>array, group);
  }
}
