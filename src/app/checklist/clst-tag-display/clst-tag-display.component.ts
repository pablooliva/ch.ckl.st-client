import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: "clst-tag-display",
  templateUrl: "./clst-tag-display.component.html",
  styleUrls: ["./clst-tag-display.component.scss"]
})
export class ClstTagDisplayComponent implements OnInit, OnChanges {
  @Input() color: string;
  @Input() label: string;
  @Input() icon: string;

  public colorPicked: string;
  public labelPicked: string;
  public iconPicked: string;

  constructor() {}

  public ngOnInit(): void {}

  public ngOnChanges(): void {
    this.colorPicked = this.color;
    this.labelPicked = this.label;
    this.iconPicked = this.icon;
  }

  public getBorderLeft(color: string): string {
    return "9px solid " + color;
  }
}
