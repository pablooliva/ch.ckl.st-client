import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ToastrService } from "ngx-toastr";

import { DataPersistenceService } from "../../../shared/data-persistence.service";
import { AuthService } from "../../../shared/auth.service";
import { AppStateService } from "../../../shared/app-state.service";
import { ServerConnectService } from "../../../shared/server-connect.service";

@Component({
  selector: "clst-share-preview",
  templateUrl: "./clst-share-preview.component.html",
  styleUrls: ["./clst-share-preview.component.scss"]
})
export class ClstSharePreviewComponent implements OnInit, OnDestroy {
  public belongsToUser: Observable<boolean>;
  public isLoggedIn: Observable<boolean>;
  public link: string;
  public copyLabel: string;

  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _dataPersistence: DataPersistenceService,
    private _authService: AuthService,
    private _router: Router,
    private _appStateService: AppStateService,
    private _serverConnectService: ServerConnectService,
    private _toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this.copyLabel = "Copy link";
    this.isLoggedIn = this._authService.isLoggedIn.asObservable();
    this.belongsToUser = this._dataPersistence.belongsToOwner.asObservable();
    this.link = window.location.href;
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  // logged in, customize the checklist
  public cloneChecklist(): void {
    this._dataPersistence.prepChecklistDataClone();
    this._router.navigate(["/clone"]);
  }

  // logged in, just use the checklist as-is
  public useAsIsChecklist(): void {
    this._appStateService.setUsePending(this._dataPersistence.checklistId);

    const useCopyPath = "use/copy";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const reqBody = {
      pendingCID: this._dataPersistence.checklistId,
      pendingUID: this._dataPersistence.user
    };

    this._serverConnectService
      .useCopy(useCopyPath, JSON.stringify(reqBody), httpOptions)
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          this._toastr.success(
            val.uiMessage + " Re-directing you to your new checklist.",
            val.type
          );
          const useRoute = "/use/" + val.serverResponse.newCID;
          setTimeout(() => this._router.navigate([useRoute]), 500);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
        }
      );
  }

  // non-logged in, no intent to register
  public useAsAnonymous(): void {
    this._appStateService.setUsePending(this._dataPersistence.checklistId);

    const useCopyPath = "use/copy";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const reqBody = {
      pendingCID: this._dataPersistence.checklistId
    };

    this._serverConnectService
      .useCopy(useCopyPath, JSON.stringify(reqBody), httpOptions)
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          this._toastr.success(
            val.uiMessage + " Re-directing you to your new checklist.",
            val.type
          );
          const useRoute = "/anon/" + val.serverResponse.newCID;
          setTimeout(() => this._router.navigate([useRoute]), 500);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
        }
      );
  }

  // non-logged in, pre-registered users
  public useAsToBeRegistered(): void {
    this._appStateService.setUsePending(this._dataPersistence.checklistId);
    this._router.navigate(["/register"]);
  }
}
