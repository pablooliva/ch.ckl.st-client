import { Component, ElementRef } from "@angular/core";
import { ClstBaseComponent } from "../../../shared/clst-base.component";
import { RootListenerService } from "../../../shared/root-listener.service";
import { Router } from "@angular/router";

@Component({
  selector: "clst-use",
  templateUrl: "./clst-use.component.html",
  styleUrls: ["./clst-use.component.scss"]
})
export class ClstUseComponent extends ClstBaseComponent {
  constructor(
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }
}
