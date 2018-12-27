import { AfterViewChecked, Directive, ElementRef, HostListener } from "@angular/core";

import { resizeElement } from "./clst-utils";

@Directive({
  selector: "[clstResizeElement]"
})
export class ResizeElementDirective implements AfterViewChecked {
  @HostListener("window:resize")
  public onResize() {
    resizeElement(this._elementRef, "iframe");
  }

  constructor(private _elementRef: ElementRef) {}

  public ngAfterViewChecked(): void {
    resizeElement(this._elementRef, "iframe");
  }
}
