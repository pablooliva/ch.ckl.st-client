import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";

/*
Thanks Tomek Sułkowski for the solution:
https://blog.usejournal.com/angular-techniques-improve-submit-buttons-ux-by-not-disabling-it-896992a94a38
 */

@Directive({
  selector: "[clstSubmitIfValid]"
})
export class SubmitIfValidDirective {
  // tslint:disable-next-line:no-input-rename
  @Input("clstSubmitIfValid") formRef: FormGroup;
  @Output() valid = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef) {}

  @HostListener("click")
  handleClick() {
    this._displayButton(1);

    this._markFieldsAsDirty();
    this._emitIfValid();
  }

  private _markFieldsAsDirty(): void {
    Object.keys(this.formRef.controls).forEach(fieldName =>
      this.formRef.controls[fieldName].markAsDirty()
    );
  }

  private _emitIfValid(): void {
    if (this.formRef.valid) {
      this.valid.emit();
    } else {
      this._displayButton(0);
    }
  }

  private _displayButton(idxToDisplay: number): void {
    const childLen = this._elementRef.nativeElement.children.length;

    for (let i = 0; i < childLen; i++) {
      this._resetButtonClasses(i);
      const display = idxToDisplay === i ? "show" : "hide";
      this._elementRef.nativeElement.children[i].classList.add(display);
    }
  }

  private _resetButtonClasses(idx: number): void {
    if (
      this._elementRef.nativeElement.children[idx].classList.contains("show")
    ) {
      this._elementRef.nativeElement.children[idx].classList.remove("show");
    }
    if (
      this._elementRef.nativeElement.children[idx].classList.contains("hide")
    ) {
      this._elementRef.nativeElement.children[idx].classList.remove("hide");
    }
  }
}
