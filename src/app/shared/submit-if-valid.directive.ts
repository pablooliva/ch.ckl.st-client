import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

import { traverseControls } from "./clst-utils";
import { ButtonStatus } from "./submit-button.directive";

/*
Thanks Tomek Sułkowski for this solution:
https://blog.usejournal.com/angular-techniques-improve-submit-buttons-ux-by-not-disabling-it-896992a94a38
 */

@Directive({
  selector: "[clstSubmitIfValid]"
})
export class SubmitIfValidDirective implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-input-rename
  @Input("clstSubmitIfValid")
  formRef: FormGroup;
  @Input()
  reset: Observable<boolean>;
  @Output()
  valid = new EventEmitter<void>();

  private _classList: ButtonStatus[];

  @HostListener("click")
  handleClick() {
    traverseControls(this.formRef.controls);
    this._emitIfValid();
  }

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this._classList = ["pre-submit", "in-progress", "post-submit"];
    this.reset.subscribe(_ => this._displayButton("pre-submit"));
  }

  public ngAfterViewInit(): void {
    this._displayButton("pre-submit");
  }

  private _emitIfValid(): void {
    if (this.formRef.valid) {
      this._displayButton("in-progress");
      this.valid.emit();
    } else {
      this._toastr.error("Please review the form for errors and try again.", "Action Failed");
    }
  }

  private _displayButton(btn: ButtonStatus): void {
    this._classList.forEach(cls => this._renderer.removeClass(this._elementRef.nativeElement, cls));
    this._renderer.addClass(this._elementRef.nativeElement, btn);
  }
}
