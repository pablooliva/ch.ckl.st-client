import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

export function genericValidationTest(
  formRef: FormGroup,
  control: string,
  valType: string
): boolean {
  const testField = formRef.get(control);
  return testField.hasError(valType) && (testField.dirty || testField.touched);
}

export function traverseControls(
  ctrls: { [c: string]: AbstractControl } | FormArray | FormGroup
): void {
  if (Array.isArray(ctrls)) {
    ctrls.forEach(ctrl => traverseControls(ctrl.controls));
  } else if (typeof ctrls === "object") {
    Object.keys(ctrls).forEach(ctrl => {
      if (ctrls[ctrl].controls) {
        traverseControls(ctrls[ctrl].controls);
      } else {
        markFieldsAsDirty(ctrls[ctrl]);
      }
    });
  } else {
    markFieldsAsDirty(ctrls);
  }
}

function markFieldsAsDirty(ctrl: FormControl): void {
  ctrl.markAsDirty();
  ctrl.markAsTouched();
}
