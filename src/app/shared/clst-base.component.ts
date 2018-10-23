import { NavigationEnd, Router } from "@angular/router";
import { OnInit, AfterViewChecked, ElementRef, OnDestroy } from "@angular/core";
import { filter } from "rxjs/operators";

import { RootListenerService } from "./root-listener.service";

export class ClstBaseComponent implements AfterViewChecked, OnInit, OnDestroy {
  private _observer: MutationObserver;

  constructor(
    private _routerBase: Router,
    private _elBase: ElementRef,
    private _rootListenerBase: RootListenerService
  ) {}

  public ngOnInit(): void {
    this._routerBase.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

    this._observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          this._announceHeight();
        }
      }
    });
    this._observer.observe(this._elBase.nativeElement, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

  public ngAfterViewChecked(): void {
    this._announceHeight();
  }

  public ngOnDestroy(): void {
    this._observer.disconnect();
  }

  private _announceHeight(): void {
    this._rootListenerBase.updateHeight(
      this._elBase.nativeElement.scrollHeight
    );
  }
}
