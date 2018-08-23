import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { DataPersistenceService } from "../../../shared/data-persistence.service";
import { AuthService } from "../../../shared/auth.service";
import { AppStateService } from "../../../shared/app-state.service";

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
    private _router: Router,
    private _appStateService: AppStateService
  ) {}

  public ngOnInit(): void {
    this.copyLabel = "Copy";
    this.isLoggedIn = this._authService.isLoggedIn.asObservable();
    this.belongsToUser = this._dataPersistence.belongsToOwner.asObservable();
    this.link = window.location.href;
  }

  public cloneChecklist(): void {
    this._prepClone();
    this._router.navigate(["/clone"]);
  }

  public cloneAsAnonymous(): void {
    this._prepClone();
  }

  public cloneAsRegistered(): void {
    this._prepClone();
    this._appStateService.setClonePending(this._dataPersistence.checklistId);
    this._router.navigate(["/register"]);
  }

  private _prepClone(): void {
    this._dataPersistence.prepChecklistDataClone();
  }
}
