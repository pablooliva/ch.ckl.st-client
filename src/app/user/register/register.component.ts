import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

import { ServerConnectService } from "../../shared/server-connect.service";

@Component({
  selector: "clst-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private _serverConnectService: ServerConnectService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this._fb.group({
      email: "",
      password: ""
    });
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
      .subscribe(
        val => this._toastr.success(val.uiMessage, val.type),
        error => this._toastr.error(error.uiMessage, error.type)
      );
  }
}
