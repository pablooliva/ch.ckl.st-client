import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
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
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
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
        val => console.warn("val after post", val),
        error => console.error(error)
      );
  }
}
