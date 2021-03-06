import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ServerConnectService } from "../../shared/server-connect.service";
import { genericValidationTest } from "../../shared/clst-utils";
import { RootListenerService } from "../../shared/root-listener.service";
import { ClstBaseComponent } from "../../shared/clst-base.component";

@Component({
  selector: "clst-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent extends ClstBaseComponent
  implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public buttonReset: Subject<boolean> = new Subject<boolean>();

  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _serverConnectService: ServerConnectService,
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

    this.registerForm = this._fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)])
      ]
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
    const registerPath = "/register";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    this._serverConnectService
      .registerUser(
        registerPath,
        JSON.stringify(this.registerForm.value),
        httpOptions
      )
      .pipe(takeUntil(this._destroy))
      .subscribe(
        val => {
          this._toastr.success(
            val.uiMessage + " Re-directing you to login.",
            val.type
          );
          setTimeout(() => this._router.navigate(["/login"]), 1000);
          this.buttonReset.next(true);
        },
        error => {
          this._toastr.error(error.uiMessage, error.type);
          this.buttonReset.next(true);
        }
      );
  }

  public testReq(formField: string): boolean {
    return genericValidationTest(this.registerForm, formField, "required");
  }

  public testLen(formField: string): boolean {
    return genericValidationTest(this.registerForm, formField, "minlength");
  }

  public testEmail(formField: string): boolean {
    return genericValidationTest(this.registerForm, formField, "email");
  }
}
