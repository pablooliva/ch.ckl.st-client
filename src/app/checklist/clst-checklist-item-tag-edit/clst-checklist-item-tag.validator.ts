import { AbstractControl } from "@angular/forms";

export function UniqueLabel(control: AbstractControl) {
  return this._dataPersistence
    .getChecklistTags()
    .find(item => item.label === control.value)
    ? { uniqueLabel: true }
    : null;
}
