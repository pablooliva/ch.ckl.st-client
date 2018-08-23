import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ServerConnectService } from "../../shared/server-connect.service";
import { AppStateService } from "../../shared/app-state.service";
import { genericValidationTest } from "../../shared/clst-utils";

@Component({
  selector: "clst-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public buttonReset: Subject<boolean> = new Subject<boolean>();

  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _serverConnectService: ServerConnectService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router,
    private _appStateService: AppStateService
  ) {}

  public ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required]
    });
  }

  public ngOnDestroy(): void {
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

    this._serverConnectService
      .loginUser(loginPath, JSON.stringify(this.loginForm.value), httpOptions)
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          if (this._appStateService.isClonePending()) {
            this._toastr.success(
              val.uiMessage + " Re-directing you to your new checklist.",
              val.type
            );
            setTimeout(() => this._router.navigate(["/clone"]), 500);
          } else {
            this._toastr.success(
              val.uiMessage + " Re-directing you to your checklists.",
              val.type
            );
            setTimeout(() => this._router.navigate(["/dashboard"]), 500);
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
