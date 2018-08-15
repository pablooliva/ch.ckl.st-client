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
import { Observable } from "rxjs";

export type ButtonStatus = "pre-submit" | "in-progress" | "post-submit";

@Directive({
  selector: "[clstSubmitButton]"
})
export class SubmitButtonDirective implements OnInit, AfterViewInit {
  @Input() reset: Observable<boolean>;
  @Output() continue = new EventEmitter<void>();

  private _classList: ButtonStatus[];

  @HostListener("click")
  handleClick() {
    this._displayButton("in-progress");
    this.continue.emit();
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  public ngOnInit(): void {
    this._classList = ["pre-submit", "in-progress", "post-submit"];
    this.reset.subscribe(_ => this._displayButton("pre-submit"));
  }

  public ngAfterViewInit(): void {
    this._displayButton("pre-submit");
  }

  private _displayButton(btn: ButtonStatus): void {
    this._classList.forEach(cls =>
      this._renderer.removeClass(this._elementRef.nativeElement, cls)
    );
    this._renderer.addClass(this._elementRef.nativeElement, btn);
  }
}
