import { AbstractControl } from "@angular/forms";

import { materialIconsNames } from "./material-icons-names";

export function UniqueLabel(control: AbstractControl) {
  if (this.tagProps) {
    return this._dataPersistence
      .getChecklistTags()
      .find((item, idx) => item.label === control.value && idx !== this.tagProps.index)
      ? { uniqueLabel: true }
      : null;
  } else {
    return this._dataPersistence.getChecklistTags().find(item => item.label === control.value)
      ? { uniqueLabel: true }
      : null;
  }
}

export function ValidMatIcon(control: AbstractControl) {
  const iconNames = this.options ? this.options : materialIconsNames;
  return iconNames.find(option => option === control.value) ? null : { validMatIcon: true };
}
