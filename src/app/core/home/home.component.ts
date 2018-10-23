import { Component, ElementRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { RootListenerService } from "../../shared/root-listener.service";
import { ClstBaseComponent } from "../../shared/clst-base.component";

@Component({
  selector: "clst-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent extends ClstBaseComponent implements OnInit {
  constructor(
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }
}
