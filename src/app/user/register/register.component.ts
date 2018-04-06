import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "clst-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(private _http: HttpClient, public fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: "",
      password: ""
    });
  }

  public onSubmit(): void {
    const registerUrl = "http://127.0.0.1:3000/register";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    this._http
      .post(registerUrl, JSON.stringify(this.registerForm.value), httpOptions)
      .subscribe(
        val => console.warn("val after post", val),
        error => {
          console.error(error);
          console.error(error.error.errors);
        }
      );
  }
}
