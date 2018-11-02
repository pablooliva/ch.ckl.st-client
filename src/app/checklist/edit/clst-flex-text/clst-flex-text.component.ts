import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "clst-flex-text",
  templateUrl: "./clst-flex-text.component.html",
  styleUrls: ["./clst-flex-text.component.scss"]
})
export class ClstFlexTextComponent implements OnInit {
  @Input()
  control: FormControl;
  @Input()
  hasError: boolean;
  @Input()
  label: string;

  public inFocus: boolean;

  constructor() {}

  public ngOnInit(): void {
    console.log("control", this.control);
    this.inFocus = false;
  }

  public onBlur(): void {
    this.control.markAsTouched();
    this.inFocus = false;
  }

  public onChange(e: any): void {
    if (e.html === null) {
      this.control.patchValue("");
    }
  }

  public noValue(val: any): boolean {
    return val === "" || val === null || val === undefined;
  }
}
