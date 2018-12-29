import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ServerConnectService } from "../../shared/server-connect.service";
import { AppStateService } from "../../shared/app-state.service";
import { genericValidationTest } from "../../shared/clst-utils";
import { deepClone } from "../../shared/data-persistence.service";
import { RootListenerService } from "../../shared/root-listener.service";
import { ClstBaseComponent } from "../../shared/clst-base.component";

@Component({
  selector: "clst-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends ClstBaseComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public buttonReset: Subject<boolean> = new Subject<boolean>();

  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _serverConnectService: ServerConnectService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router,
    private _appStateService: AppStateService,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.loginForm = this._fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required]
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this._destroy.next(true);
    this._destroy.complete();
  }

  public reset(): Observable<boolean> {
    return this.buttonReset;
  }

  public onSubmit(): void {
    const loginPath = "login";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const reqBody = deepClone(this.loginForm.value);
    const usePending = this._appStateService.getUsePending();

    if (usePending) {
      reqBody["pendingCID"] = usePending;
    }

    this._serverConnectService
      .loginUser(loginPath, JSON.stringify(reqBody), httpOptions)
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          if (usePending) {
            this._appStateService.unsetUsePending();

            this._toastr.success(
              val.uiMessage + " Re-directing you to your new checklist.",
              val.type
            );

            const useRoute = "/use/" + val.serverResponse.newCID;
            this._router.navigate([useRoute]);
          } else {
            this._toastr.success(val.uiMessage + " Re-directing you to your checklists.", val.type);
            this._router.navigate(["/dashboard"]);
          }

          this.buttonReset.next(true);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
          this.buttonReset.next(true);
        }
      );
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.loginForm, formField, "required");
  }

  public testEmail(formField: string): boolean {
    return genericValidationTest(this.loginForm, formField, "email");
  }
}
