import { AbstractControl } from "@angular/forms";

export function UniqueLabel(control: AbstractControl) {
  if (this.tagProps) {
    return this._dataPersistence
      .getChecklistTags()
      .find(
        (item, idx) =>
          item.label === control.value && idx !== this.tagProps.index
      )
      ? { uniqueLabel: true }
      : null;
  } else {
    return this._dataPersistence
      .getChecklistTags()
      .find(item => item.label === control.value)
      ? { uniqueLabel: true }
      : null;
  }
}
