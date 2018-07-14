import { FormGroup } from "@angular/forms";

export function genericValidationTest(
  formRef: FormGroup,
  control: string,
  valType: string
): boolean {
  const testField = formRef.get(control);
  return testField.hasError(valType) && (testField.dirty || testField.touched);
}
