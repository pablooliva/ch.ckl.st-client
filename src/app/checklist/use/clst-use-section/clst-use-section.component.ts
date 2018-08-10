import { Component, Input, OnInit } from "@angular/core";

import { ISection } from "../../../shared/data-persistence.service";

@Component({
  selector: "clst-use-section",
  templateUrl: "./clst-use-section.component.html",
  styleUrls: ["./clst-use-section.component.scss"]
})
export class ClstUseSectionComponent implements OnInit {
  @Input() section: ISection;

  constructor() {}

  public ngOnInit(): void {}
}
