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
  public editorOptions: Object;

  constructor() {}

  public ngOnInit(): void {
    this.inFocus = false;
    this.editorOptions = {
      placeholder: this.label,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ header: [1, 2, 3, 4, false] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"]
        ]
      }
    };
  }

  public onFocus() {
    this.inFocus = true;
  }

  public onChange(e: any): void {
    if (e.text && e.text.length === 1) {
      this.control.patchValue(e.text.replace(/\r?\n|\r/g, ""));
    } else if (e.text === null) {
      this.control.patchValue("");
    }
    this.control.markAsTouched();
  }

  public noValue(val: any): boolean {
    return val === "" || val === null || val === undefined;
  }
}
