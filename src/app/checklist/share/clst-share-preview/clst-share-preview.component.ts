import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { DataPersistenceService } from "../../../shared/data-persistence.service";
import { AuthService } from "../../../shared/auth.service";

@Component({
  selector: "clst-share-preview",
  templateUrl: "./clst-share-preview.component.html",
  styleUrls: ["./clst-share-preview.component.scss"]
})
export class ClstSharePreviewComponent implements OnInit {
  public belongsToUser: Observable<boolean>;
  public isLoggedIn: Observable<boolean>;
  public link: string;
  public copyLabel: string;

  constructor(
    private _dataPersistence: DataPersistenceService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this.copyLabel = "Copy";
    this.isLoggedIn = this._authService.isLoggedIn.asObservable();
    this.belongsToUser = this._dataPersistence.belongsToOwner.asObservable();
    this.link = window.location.href;
  }

  public cloneChecklist(): void {
    this._dataPersistence.prepChecklistDataClone();
    this._router.navigate(["/clone"]);
  }
}
