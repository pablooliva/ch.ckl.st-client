import { Injectable } from "@angular/core";
import { FormGroup, ValidatorFn } from "@angular/forms";
import { Subject } from "rxjs";

export type pushFEType = "section" | "item";

export interface IPushFormElement {
  type: pushFEType;
  group: FormGroup;
  index: number;
  validator?: ValidatorFn;
}

@Injectable({
  providedIn: "root"
})
export class FormElementPusherService {
  public formElement: Subject<IPushFormElement>;

  constructor() {
    this.formElement = new Subject<IPushFormElement>();
  }

  public pushFormElement(pushed: IPushFormElement): void {
    this.formElement.next(pushed);
  }
}
