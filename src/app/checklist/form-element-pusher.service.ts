import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs/Subject";

export enum pushFEType {
  Section = "SECTION",
  Item = "ITEM",
  Tag = "TAG"
}

export interface IPushFormElement {
  type: pushFEType;
  group: FormGroup;
  index: number;
}

@Injectable()
export class FormElementPusherService {
  public formElement: Subject<IPushFormElement>;

  constructor() {
    this.formElement = new Subject<IPushFormElement>();
  }

  public pushFormElement(pushed: IPushFormElement): void {
    this.formElement.next(pushed);
  }
}
