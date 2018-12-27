import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { ElementRef } from "@angular/core";

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

export function resizeElement(elemRef: ElementRef, elemTagName: string): any {
  const resizeFactor = elemTagName === "iframe" ? 0.5625 : 0;
  const iframes = elemRef.nativeElement.getElementsByTagName(elemTagName);
  for (let i = 0; i < iframes.length; i++) {
    const iWidth = iframes[i].clientWidth;
    iframes[0].style.height = iWidth * resizeFactor + "px";
  }
}
