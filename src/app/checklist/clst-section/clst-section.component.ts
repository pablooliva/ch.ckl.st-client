import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import {
  FormElementPusherService,
  pushFEType
} from "../form-element-pusher.service";

@Component({
  selector: "clst-section",
  templateUrl: "./clst-section.component.html",
  styleUrls: ["./clst-section.component.scss"]
})
export class ClstSectionComponent implements OnInit {
  @Input() public section: FormGroup;
  @Input() public sectionIndex: number;

  constructor(private _fEPusherService: FormElementPusherService) {}

  public ngOnInit(): void {}

  // index tracks current or next index to add/push to
  public addSection(index: number): void {
    this._fEPusherService.pushFormElement({
      type: pushFEType.Section,
      group: this.section,
      index: index
    });
  }
}
