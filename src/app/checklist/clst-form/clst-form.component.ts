import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subscription } from "rxjs";

import {
  FormElementPusherService,
  IPushFormElement,
  pushFEType
} from "../form-element-pusher.service";
import { ServerConnectService } from "../../shared/server-connect.service";

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

  private _subscription: Subscription;

  constructor(
    private _http: HttpClient,
    private _fEPusherService: FormElementPusherService,
    private _serverConnectService: ServerConnectService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this._subscription = this._fEPusherService.formElement.subscribe(
      (newElem: IPushFormElement) => {
        console.warn("*** newElem ***", newElem);

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
      }
    );

    this._initForm();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public onSubmit(): void {
    const checklistPath = "checklists";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    console.warn("user", this._serverConnectService.getUser());

    // TODO: temp hacks
    this.clForm.patchValue({
      documentTags: ["5ae0bcd65cab460b5d7dce9b"],
      checklistTags: [],
      sections: [
        {
          title: "Test Section",
          flexibleText:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          checklistItems: [
            {
              checked: true,
              label: "Checklist Item Label",
              flexibleText:
                "A short explanation about what this checklist item is about."
            }
          ]
        }
      ]
    });

    const enhancedClFormValue = JSON.parse(JSON.stringify(this.clForm.value));

    enhancedClFormValue.owner = this._serverConnectService.getUser();

    this._serverConnectService
      .postChecklist(
        checklistPath,
        JSON.stringify(enhancedClFormValue),
        httpOptions
      )
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
      public: "",
      documentTitle: "",
      documentTags: "",
      customCss: "",
      sections: this.fb.array([])
    });

    this._newSection(0, this.sections);
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
      tags: ""
    });
    const array = group
      ? null
      : parentArray.array.controls[parentArray.index].get("checklistItems");

    this._handleInsert(item, idx, <FormArray>array, group);
  }
}
