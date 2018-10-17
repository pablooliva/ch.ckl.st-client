import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";

import { ToastrService } from "ngx-toastr";

import { ServerConnectService } from "../../shared/server-connect.service";
import { DataPersistenceService } from "../../shared/data-persistence.service";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";

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
  public qryResolved: boolean;
  public checklists: IChecklistsByUser[];

  constructor(
    private _router: Router,
    private _serverConnectService: ServerConnectService,
    private _dataPersistence: DataPersistenceService,
    private _toastr: ToastrService,
    public dialog: MatDialog
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

  public openDialog(cId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: "200px",
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(cId);
      }
    });
  }

  public cloneChecklist(id: string): void {
    this._dataPersistence
      .prepareClientData(id, this._serverConnectService)
      .then(() => {
        this._dataPersistence.prepChecklistDataClone();
        this._router.navigate(["/clone"]);
      });
  }

  public delete(cId: string): void {
    const path = "checklists/" + cId;
    this._serverConnectService.deleteChecklist(path).subscribe(
      val => {
        this.checklists = this.checklists.filter(clist => clist.id !== cId);
        this._toastr.success(val.uiMessage, val.type);
      },
      error => {
        this._toastr.error(error.uiMessage, error.type);
      }
    );
  }
}
