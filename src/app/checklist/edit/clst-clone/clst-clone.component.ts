import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { RootListenerService } from "../../../shared/root-listener.service";
import { ClstBaseComponent } from "../../../shared/clst-base.component";
import { Observable, Subject } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { takeUntil } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ServerConnectService } from "../../../shared/server-connect.service";
import {
  DataPersistenceService,
  IClstFormDataModel
} from "../../../shared/data-persistence.service";
import { ToastrService } from "ngx-toastr";
import { genericValidationTest } from "../../../shared/clst-utils";

@Component({
  selector: "clst-clone",
  templateUrl: "./clst-clone.component.html",
  styleUrls: ["./clst-clone.component.scss"]
})
export class ClstCloneComponent extends ClstBaseComponent
  implements OnInit, OnDestroy {
  public clForm: FormGroup;
  public buttonReset: Subject<boolean> = new Subject<boolean>();

  private _destroy: Subject<boolean> = new Subject<boolean>();
  private _clonedData: IClstFormDataModel;

  constructor(
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this._dataPersistence
      .prepareClientData("", this._serverConnectService)
      .then((data: IClstFormDataModel) => {
        this._clonedData = data;
      });

    this.clForm = this._fb.group({
      documentTitle: ["", Validators.required]
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this._destroy.next(true);
    this._destroy.complete();
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.clForm, formField, "required");
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

    // TODO: we can not assume that clonedData is available
    this._clonedData.documentTitle = this.clForm.value["documentTitle"];

    this._serverConnectService
      .postChecklist(
        checklistPath,
        JSON.stringify(this._dataPersistence.prepareDBData(this._clonedData)),
        httpOptions
      )
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          this._toastr.success("Checklist copied successfully.", val.type);
          this.buttonReset.next(true);
          this._router.navigate(["/checklist", val.serverResponse.checklistId]);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
          this.buttonReset.next(true);
        }
      );
  }
}
