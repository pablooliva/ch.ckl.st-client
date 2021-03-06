import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormArray, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { ISection } from "../../../shared/data-persistence.service";

@Component({
  selector: "clst-use-section",
  templateUrl: "./clst-use-section.component.html",
  styleUrls: ["./clst-use-section.component.scss"]
})
export class ClstUseSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() sectionForm: FormGroup;
  @Input() sectionData: ISection;
  @Input() sectionIndex: number;
  @Input() hasItemTags: boolean;

  @ViewChild("sectionTitle", { static: false }) public sectionTitle: ElementRef;
  @ViewChild("sectionDesc", { static: false }) public sectionDesc: ElementRef;
  @ViewChild("sectionGrpActions", { static: false }) public sectionGrpActions: ElementRef;

  public displayHtml: SafeHtml;
  public sectionDescHeight: string;
  public setItemsCollapsed: boolean;

  private _isPreview: boolean;

  public get items(): FormArray {
    return this.sectionForm.get("checklistItems") as FormArray;
  }

  constructor(
    private _sanitizer: DomSanitizer,
    private _elemRef: ElementRef,
    private _renderer: Renderer2,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const regex = new RegExp(/<p><br><\/p>+$/);
    this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(
      this.sectionData.flexibleText.replace(regex, "")
    );
    this.setItemsCollapsed = false;
    this._isPreview = this._route.snapshot.url[0].path === "share" || null;
  }

  public ngAfterViewInit(): void {
    this.sectionDescHeight = this.sectionDesc
      ? window.getComputedStyle(this.sectionDesc.nativeElement).height
      : "0";
    if (this.sectionDesc) {
      this._renderer.setStyle(this.sectionDesc.nativeElement, "height", this.sectionDescHeight);
    }

    this._elemRef.nativeElement.addEventListener(
      "transitionend",
      this._handleTransitionEnd.bind(this)
    );
  }

  public ngOnDestroy(): void {
    this._elemRef.nativeElement.removeEventListener("transitionend", this._handleTransitionEnd);
  }

  public getItem(idx: number): FormGroup {
    return <FormGroup>this.items.get([idx]);
  }

  public percentDone(): number {
    const numItems = this.items.value.length;
    const numChecked = this.items.value.reduce((sum, item) => {
      return sum + item.checked;
    }, 0);
    return Math.floor((numChecked / numItems) * 100);
  }

  public itemsNotStarted(): boolean {
    return this.percentDone() === 0;
  }

  public itemsCompleted(): boolean {
    return this.percentDone() === 100;
  }

  public checkAll(): void {
    if (!this._isPreview) {
      this.setValues(true);
    }
  }

  public uncheckAll(): void {
    if (!this._isPreview) {
      this.setValues(false);
    }
  }

  public collapseSection(): void {
    this._renderer.removeClass(this.sectionTitle.nativeElement, "clst-ver-expand");
    this._renderer.removeClass(this.sectionGrpActions.nativeElement, "clst-ver-expand");
    this._renderer.removeClass(this._elemRef.nativeElement, "clst-section-expand");
    if (this.sectionDesc) {
      this._renderer.setStyle(this.sectionDesc.nativeElement, "height", "0");
    }
    this._renderer.addClass(this._elemRef.nativeElement, "clst-section-collapse");
    this._renderer.addClass(this.sectionTitle.nativeElement, "clst-ver-collapse-h");
    this._renderer.addClass(this.sectionGrpActions.nativeElement, "clst-ver-collapse");
    this.setItemsCollapsed = true;
  }

  public expandSection(): void {
    this._renderer.removeClass(this.sectionTitle.nativeElement, "clst-ver-collapse-h");
    this._renderer.removeClass(this.sectionGrpActions.nativeElement, "clst-ver-collapse");
    this._renderer.removeClass(this._elemRef.nativeElement, "clst-section-collapse");
    if (this.sectionDesc) {
      this._renderer.setStyle(this.sectionDesc.nativeElement, "height", this.sectionDescHeight);
    }
    this._renderer.addClass(this._elemRef.nativeElement, "clst-section-expand");
    this._renderer.addClass(this.sectionTitle.nativeElement, "clst-ver-expand");
    this._renderer.addClass(this.sectionGrpActions.nativeElement, "clst-ver-expand");
    this.setItemsCollapsed = false;
  }

  private setValues(val: boolean): void {
    const control = this.sectionForm.get("checklistItems") as FormArray;
    // tslint:disable-next-line
    for (const ctrl in control.controls) {
      const checkCtrl = control.controls[ctrl].get("checked");
      checkCtrl.patchValue(val);
    }
  }

  private _handleTransitionEnd(): void {
    // this will trigger the mutationObserver at end of transition, thus calculating the correct "app" height
    this._renderer.setAttribute(
      this._elemRef.nativeElement,
      "data-track-mutations",
      "transition-emit"
    );
  }
}
