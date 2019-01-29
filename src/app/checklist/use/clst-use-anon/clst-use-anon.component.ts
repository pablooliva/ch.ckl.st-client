import { Component, ElementRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ClstBaseComponent } from "../../../shared/clst-base.component";
import { RootListenerService } from "../../../shared/root-listener.service";

@Component({
  selector: "clst-use-anon",
  templateUrl: "./clst-use-anon.component.html",
  styleUrls: ["./clst-use-anon.component.scss"]
})
export class ClstUseAnonComponent extends ClstBaseComponent implements OnInit {
  public link: string;
  public copyLabel: string;

  constructor(
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.copyLabel = "Copy link";
    this.link = window.location.href;
  }
}
