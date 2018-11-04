import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher, MatDialog } from "@angular/material";
import { Subject } from "rxjs";

import { FormElementPusherService } from "../../../shared/form-element-pusher.service";
import {
  ClstDialogComponent,
  IDialogBody
} from "../../../shared/dialog/clst-dialog/clst-dialog.component";

@Component({
  selector: "clst-section",
  templateUrl: "./clst-section.component.html",
  styleUrls: ["./clst-section.component.scss"]
})
export class ClstSectionComponent implements OnInit {
  @Input()
  public section: FormGroup;
  @Input()
  public sectionIndex: number;
  @Input()
  public form: FormGroup;

  public matcher = new CustomErrorStateMatcher();
  public inFocusObs = new Subject<boolean>();

  constructor(private _fEPusherService: FormElementPusherService, public dialog: MatDialog) {}

  public ngOnInit(): void {}

  // index tracks current or next index to add/push to
  public addSection(index: number): void {
    this._fEPusherService.pushFormElement({
      type: "section",
      group: this.section,
      index: index,
      validator: oneOfRequiredValidator
    });
  }

  public confirmSectionDelete(index: number): void {
    const dialogBody: IDialogBody = {
      title: "Delete Section",
      body: "Are you sure?",
      buttons: {
        primary: {
          color: "warn",
          label: "Yes",
          value: true
        },
        secondary: {
          color: "primary",
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._removeSection(index);
      }
    });
  }

  private _removeSection(index: number): void {
    (<FormArray>this.form.controls["sections"]).removeAt(index);
    if (!(<FormArray>this.form.controls["sections"]).length) {
      this.addSection(0);
    }
  }

  public errorEval(): boolean {
    return (
      this.section.hasError("titleOrDescriptionRequired") &&
      this.matcher.isErrorState(<FormControl>this.section.controls["flexibleText"], null)
    );
  }

  public onBlur(): void {
    this.inFocusObs.next(false);
  }
}

export function oneOfRequiredValidator(group: FormGroup): { [s: string]: boolean } {
  if (group) {
    if (group.controls["title"].value || group.controls["flexibleText"].value) {
      return null;
    }
  }
  return { titleOrDescriptionRequired: true };
}

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);

    const parentInvalid = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      (control.parent.dirty || control.parent.touched) &&
      (control.parent.value["title"] === "" && control.parent.value["flexibleText"] === "")
    );

    return controlTouched && (controlInvalid || parentInvalid);
  }
}
