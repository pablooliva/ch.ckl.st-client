import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { MatDialog } from "@angular/material";
import * as _ from "lodash";

import { ClstDialogComponent, IDialogBody } from "./dialog/clst-dialog/clst-dialog.component";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
  savePendingChanges: () => Promise<boolean>;
}

@Injectable({
  providedIn: "root"
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  private _componentRef: any;

  constructor(public dialog: MatDialog) {}

  async canDeactivate(component: ComponentCanDeactivate): Promise<boolean> {
    this._componentRef = _.cloneDeep(component);

    return component.canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        // confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
        await this.openDialog();
  }

  public async openDialog(): Promise<boolean> {
    const dialogBody: IDialogBody = {
      title: "Save Changes",
      body: "You have unsaved changes. Save changes?",
      buttons: {
        primary: {
          color: "primary",
          label: "Yes",
          value: true
        },
        secondary: {
          color: "warn",
          label: "No",
          value: false
        }
      }
    };

    const dialogRef = this.dialog.open(ClstDialogComponent, {
      height: "200px",
      width: "250px",
      data: dialogBody
    });

    return await dialogRef
      .afterClosed()
      .toPromise()
      .then(dialogResult => {
        if (dialogResult) {
          return this._componentRef.savePendingChanges().then(saveResult => saveResult);
        } else {
          return true;
        }
      });
  }
}
