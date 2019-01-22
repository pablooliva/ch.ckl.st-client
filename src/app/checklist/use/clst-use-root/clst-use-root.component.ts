import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
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
  IClstFormDataModel,
  ISection
} from "../../../shared/data-persistence.service";
import { convertToAnchorFriendly } from "../../../shared/clst-utils";

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
  @Output()
  cListLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public cId: string;
  public clstData: IClstFormDataModel | IClstDataModel;
  public displayHtml: SafeHtml;
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
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.noData = false;
    this.cListLoaded.next(false);
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
          const regex = new RegExp(/<p><br><\/p>+$/);
          this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(
            this.clstData.flexibleText.replace(regex, "")
          );
          this.hasItemTags =
            !!(this.clstData as IClstDataModel).checklistTags.length && this._areItemTagsEnabled();

          this.clForm.valueChanges
            .pipe(
              takeUntil(this._destroy),
              auditTime(500)
            )
            .subscribe(() => this._postFormData());

          this.cListLoaded.next(true);
        } else {
          this.noData = true;
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public getSection(idx: number): FormGroup {
    return <FormGroup>this.sections.get([idx]);
  }

  public handleAnchorClick(ev: MouseEvent, candidate: string): void {
    ev.preventDefault();
    const id = convertToAnchorFriendly(candidate);
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
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

  public getAnchor(candidate: string): string {
    return window.location.pathname + "/#" + convertToAnchorFriendly(candidate);
  }

  public getIdAsAnchor(candidate: string): string {
    return convertToAnchorFriendly(candidate);
  }

  public getClass(section: ISection): string {
    const percentDone = this._percentDone(section);
    let classVal = "";
    switch (percentDone) {
      case 0:
        classVal = "clst-item-theme-default";
        break;
      case 100:
        classVal = "clst-item-theme-completed";
        break;
      default:
        classVal = "clst-item-theme-started";
    }
    return classVal;
  }

  public getTitle(section: ISection): string {
    return this._percentDone(section) + "% done";
  }

  private _percentDone(section: ISection): number {
    const numItems = section.checklistItems.length;
    const numChecked = section.checklistItems.reduce((sum, item) => {
      return sum + Number(item.checked);
    }, 0);
    return Math.floor((numChecked / numItems) * 100);
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
