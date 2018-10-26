import { OnInit, Component, ViewChild, OnDestroy } from "@angular/core";
import { ObservableMedia } from "@angular/flex-layout";
import { MatSidenav } from "@angular/material";
import { Data } from "@angular/router";
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from "@angular/animations";
import { Observable, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";

import { AuthService } from "./shared/auth.service";
import { RootListenerService } from "./shared/root-listener.service";

@Component({
  selector: "clst-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("animRoutes", [
      transition("* <=> *", [
        group([
          query(
            ":enter",
            [
              style({
                opacity: 0,
                transform: "translateY(10vh)"
              }),
              animate(
                "0.35s cubic-bezier(0, 1.8, 1, 1.8)",
                style({ opacity: 1, transform: "translateY(0)" })
              ),
              animateChild()
            ],
            { optional: true }
          ),
          query(
            ":leave",
            [
              animate(
                "0.35s",
                style({ opacity: 0, transform: "translateY(50vh)" })
              ),
              animateChild()
            ],
            { optional: true }
          )
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav") sidenav: MatSidenav;

  public isLoggedIn: Observable<boolean>;
  public height: Observable<string>;

  private _destroy: Subject<boolean> = new Subject<boolean>();
  private _lastHeight: number;

  constructor(
    public media: ObservableMedia,
    private _authService: AuthService,
    private _rootListener: RootListenerService
  ) {}

  public ngOnInit(): void {
    this.media
      .asObservable()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => this._handleSideNav());

    this.isLoggedIn = this._authService.isLoggedIn;
    this._lastHeight = 0;
    this.height = this._rootListener.changeEmitted.pipe(
      filter(height => height !== this._lastHeight),
      map((height: number) => {
        this._lastHeight = height;
        return height + "px";
      })
    );
  }

  public ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.complete();
  }

  public logOut(): void {
    this._authService.setLogOut();
  }

  public getPage(outlet): Data {
    return outlet.activatedRouteData.page || "home";
  }

  private _handleSideNav(): void {
    if (!this.media.isActive("xs") && this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
}
