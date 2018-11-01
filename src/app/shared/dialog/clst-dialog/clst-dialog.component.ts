import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { DashboardComponent } from "../../../user/dashboard/dashboard.component";

export interface IDialogButton {
  color: string;
  label: string;
  value: any;
}

export interface IDialogBody {
  title: string;
  body: string;
  buttons: {
    primary: IDialogButton;
    secondary: IDialogButton;
  };
}

@Component({
  selector: "clst-dialog",
  templateUrl: "./clst-dialog.component.html",
  styleUrls: ["./clst-dialog.component.scss"]
})
export class ClstDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogBody,
    public dialogRef: MatDialogRef<DashboardComponent>
  ) {}
}
