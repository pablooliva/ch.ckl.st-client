import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: "clst-delete-confirmation",
  templateUrl: "./delete-confirmation.component.html",
  styleUrls: ["./delete-confirmation.component.scss"]
})
export class DeleteConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<DashboardComponent>) {}
}
