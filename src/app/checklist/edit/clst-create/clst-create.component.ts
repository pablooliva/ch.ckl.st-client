import { Component, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { RootListenerService } from "../../../shared/root-listener.service";
import { ClstBaseComponent } from "../../../shared/clst-base.component";

@Component({
  selector: "clst-checklist",
  templateUrl: "./clst-create.component.html",
  styleUrls: ["./clst-create.component.scss"]
})
export class ClstCreateComponent extends ClstBaseComponent implements OnInit {
  public clstId: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _el: ElementRef,
    private _rootListener: RootListenerService
  ) {
    super(_router, _el, _rootListener);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.clstId = this._route.snapshot.params["id"];
  }
}
