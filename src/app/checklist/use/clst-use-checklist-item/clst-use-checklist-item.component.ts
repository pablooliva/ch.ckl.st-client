import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import {
  DataPersistenceService,
  IChecklistItem,
  IChecklistItemTag
} from "../../../shared/data-persistence.service";

@Component({
  selector: "clst-use-checklist-item",
  templateUrl: "./clst-use-checklist-item.component.html",
  styleUrls: ["./clst-use-checklist-item.component.scss"]
})
export class ClstUseChecklistItemComponent
  implements OnChanges, OnInit, AfterViewInit, AfterViewChecked {
  @Input() itemForm: FormGroup;
  @Input() itemData: IChecklistItem;
  @Input() itemIndex: number;
  @Input() sectionIndex: number;
  @Input() hasItemTags: boolean;
  @Input() isCollapsed: boolean;

  public checklistTags: IChecklistItemTag[];
  public isPreview: boolean;
  public displayHtml: SafeHtml;
  public clistItemHeight: string;

  private _elemWidth: string;

  constructor(
    private _dataPersistence: DataPersistenceService,
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes["isCollapsed"].firstChange) {
      if (changes["isCollapsed"].currentValue) {
        this._renderer.setStyle(this._elementRef.nativeElement, "height", "0");
      } else {
        this._renderer.setStyle(this._elementRef.nativeElement, "height", this.clistItemHeight);
      }
    }
  }

  public ngOnInit(): void {
    const regex = new RegExp(/<p><br><\/p>+$/);
    this.displayHtml = this._sanitizer.bypassSecurityTrustHtml(
      this.itemData.flexibleText.replace(regex, "")
    );
    this.checklistTags = this._dataPersistence.getChecklistTags();
    this.isPreview = this._route.snapshot.url[0].path === "share" || null;

    this._getElemWidth();
  }

  public ngAfterViewChecked(): void {
    this._setAnchorWidth();
  }

  public ngAfterViewInit(): void {
    this.clistItemHeight = window.getComputedStyle(this._elementRef.nativeElement).height;
    this._renderer.setStyle(this._elementRef.nativeElement, "height", this.clistItemHeight);
  }

  private _getElemWidth(): void {
    this._elemWidth = window.getComputedStyle(this._elementRef.nativeElement).width;
  }

  private _setAnchorWidth(): void {
    const anchors = this._elementRef.nativeElement.getElementsByTagName("a");
    const adjustedElemWidth = parseInt(this._elemWidth.split("px")[0], 10) - 70 + "px";
    for (let i = 0; i < anchors.length; i++) {
      if (anchors[i].text.toLowerCase().indexOf("http") === 0) {
        this._renderer.setStyle(anchors[i], "max-width", adjustedElemWidth);
        this._renderer.addClass(anchors[i], "adjust-for-url");
      }
    }
  }
}
