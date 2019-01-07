import { Component, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { RootListenerService } from "../../shared/root-listener.service";
import { ClstBaseComponent } from "../../shared/clst-base.component";

@Component({
  selector: "clst-not-found",
  templateUrl: "./clst-not-found.component.html",
  styleUrls: ["./clst-not-found.component.scss"]
})
export class ClstNotFoundComponent extends ClstBaseComponent {
  constructor(
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }
}
