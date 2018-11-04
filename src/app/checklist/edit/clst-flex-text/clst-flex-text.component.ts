import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

@Component({
  selector: "clst-flex-text",
  templateUrl: "./clst-flex-text.component.html",
  styleUrls: ["./clst-flex-text.component.scss"]
})
export class ClstFlexTextComponent implements OnInit, OnDestroy {
  @Input()
  control: FormControl;
  @Input()
  hasError: boolean;
  @Input()
  label: string;
  @Input()
  inFocusObs: Subject<boolean>;

  public inFocus: boolean;
  public editorOptions: Object;

  private _destroy: Subject<boolean> = new Subject<boolean>();

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

    this.inFocusObs
      .pipe(
        takeUntil(this._destroy),
        debounceTime(500)
      )
      .subscribe(state => {
        this.inFocus = state;
      });
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public onFocus() {
    this.inFocusObs.next(true);
  }

  public onBlur(): void {
    const val = this.control.value;
    if (val === null) {
      this.control.patchValue("");
    } else if (val.length === 1) {
      this.control.patchValue(val.replace(/\r?\n|\r/g, ""));
    }
  }

  public onChange(e: any): void {
    if (e.text === null || e.html === null) {
      this.control.patchValue("");
    } else if (e.text && e.text.length === 1) {
      this.control.patchValue(e.text.replace(/\r?\n|\r/g, ""));
    }
    this.control.markAsTouched();
  }
}
