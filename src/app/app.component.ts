import { OnInit, Component, ViewChild } from "@angular/core";
import { ObservableMedia } from "@angular/flex-layout";
import { MatSidenav } from "@angular/material";

@Component({
  selector: "clst-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  @ViewChild("sidenav") sidenav: MatSidenav;

  constructor(public media: ObservableMedia) {}

  public ngOnInit(): void {
    this.media.asObservable().subscribe(() => this._handleSideNav());
  }

  private _handleSideNav(): void {
    if (!this.media.isActive("xs") && this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
}
