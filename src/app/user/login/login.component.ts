import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { ServerConnectService } from "../../shared/server-connect.service";

@Component({
  selector: "clst-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private _serverConnectService: ServerConnectService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required]
    });
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
      .subscribe(
        val => {
          this._toastr.success(
            val.uiMessage + " Re-directing you to your checklists.",
            val.type
          );
          setTimeout(() => this._router.navigate(["/checklist"]), 3000);
        },
        error => this._toastr.error(error.uiMessage, error.type)
      );
  }

  /*public accessTest() {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbnMiOltdLCJfaWQiOiI1YWM3OWJiM2E0NWQzZjAwOGU2NDU0YTMiLCJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEyJEhiLnhCWURVdVA0eENQeElBZlkwNU9MT3lrMFBQc0ZxandiY2RpeDJNQWhwa25LRXhuRFAuIiwiY3JlYXRlZEF0IjoiMjAxOC0wNC0wNlQxNjowOToyMy45MTlaIiwidXBkYXRlZEF0IjoiMjAxOC0wNC0wNlQxNjowOToyMy45MTlaIiwiX192IjowfQ.dZ-rZo-H5rZsC44Rw59VnDoQZfiT7qL2S880ritCdYM"
        })
      };

      this._http
        .get("http://127.0.0.1:3000/test", httpOptions)
        .subscribe(response => console.warn("TEST RESPONSE", response));
  }*/
}
