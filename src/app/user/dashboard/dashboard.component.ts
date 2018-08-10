import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ServerConnectService } from "../../shared/server-connect.service";
import { DataPersistenceService } from "../../shared/data-persistence.service";

interface IChecklistsByUser {
  id: string;
  title: string;
}

@Component({
  selector: "clst-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  public checklists: IChecklistsByUser[];
  public qryResolved: boolean;

  constructor(
    private _router: Router,
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService
  ) {}

  public ngOnInit(): void {
    this.checklists = [];
    this.qryResolved = false;

    const path = "checklists/user/" + this._dataPersistence.user;
    this._serverConnectService
      .getChecklists(path)
      .then((response: IChecklistsByUser[]) => {
        this.checklists = response;
        this.qryResolved = true;
      });
  }

  public create(): void {
    this._router.navigate(["/checklist"]);
  }
}
