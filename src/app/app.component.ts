import { OnInit, Component, ViewChild } from "@angular/core";
import { ObservableMedia } from "@angular/flex-layout";
import { MatSidenav } from "@angular/material";
import { AuthService } from "./shared/auth.service";

@Component({
  selector: "clst-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  @ViewChild("sidenav") sidenav: MatSidenav;

  public isLoggedIn: boolean;

  constructor(
    public media: ObservableMedia,
    private _authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.media.asObservable().subscribe(() => this._handleSideNav());
    this.isLoggedIn = false;
    this._authService.isLoggedIn.subscribe(
      status => (this.isLoggedIn = status)
    );
  }

  public logOut(): void {
    this._authService.setLogOut();
  }

  private _handleSideNav(): void {
    if (!this.media.isActive("xs") && this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
}
