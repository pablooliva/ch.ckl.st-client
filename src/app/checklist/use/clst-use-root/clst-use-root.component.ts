import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { auditTime, takeUntil } from "rxjs/operators";

import { ServerConnectService } from "../../../shared/server-connect.service";
import {
  DataPersistenceService,
  IClstDataModel,
  IClstFormDataModel
} from "../../../shared/data-persistence.service";

@Component({
  selector: "clst-use-root",
  templateUrl: "./clst-use-root.component.html",
  styleUrls: ["./clst-use-root.component.scss"]
})
export class ClstUseRootComponent implements OnInit, OnDestroy {
  @Input()
  sharePreview: boolean;
  @Input()
  isAnon: boolean;

  public cId: string;
  public clstData: IClstFormDataModel | IClstDataModel;
  public noData: boolean;
  public clForm: FormGroup;
  public hasItemTags: boolean;

  public get sections(): FormArray {
    return this.clForm.get("sections") as FormArray;
  }

  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.noData = false;
    this.cId = this._route.snapshot.params["id"];

    this._dataPersistence
      .prepareClientData(this.cId, this._serverConnectService)
      .then((data: IClstFormDataModel) => {
        if (!!data) {
          this.clForm = this._fb.group({
            sections: this._fb.array([])
          });

          data.sections.forEach(section => {
            const checklistItems = this._fb.array([]);

            section["checklistItems"].forEach(cItem => {
              const showChecked = this.sharePreview ? false : cItem.checked ? cItem.checked : false;

              const item = this._fb.group({
                label: cItem.label,
                checked: showChecked
              });
              checklistItems.push(item);
            });

            const sectionGroup = this._fb.group({
              checklistItems: checklistItems
            });

            this.sections.push(sectionGroup);
          });

          this.clstData = data;
          this.hasItemTags =
            !!(this.clstData as IClstDataModel).checklistTags.length && this._areItemTagsEnabled();
        } else {
          this.noData = true;
        }

        this.clForm.valueChanges
          .pipe(
            takeUntil(this._destroy),
            auditTime(500)
          )
          .subscribe(() => this._postFormData());
      });
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public getSection(idx: number): FormGroup {
    return <FormGroup>this.sections.get([idx]);
  }

  private _postFormData(): void {
    const checklistPath = this.isAnon ? "anonchecklists" : "use";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    this._serverConnectService
      .postChecklist(
        checklistPath,
        JSON.stringify(this._dataPersistence.saveUse(this.clForm.value)),
        httpOptions
      )
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          console.log(val.uiMessage);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
        }
      );
  }

  public cloneChecklist(): void {
    this._dataPersistence.prepChecklistDataClone();
    this._router.navigate(["/clone"]);
  }

  public editChecklist(): void {
    this._router.navigate(["/checklist", this.cId]);
  }

  public shareChecklist(): void {
    this._router.navigate(["/share", this.cId]);
  }

  private _areItemTagsEnabled(): boolean {
    return !!this.clstData.sections.find(section => {
      return !!section.checklistItems.find(item => {
        return !!item.checklistTagsEnabled.find(tag => {
          return tag.tag === true;
        });
      });
    });
  }
}
