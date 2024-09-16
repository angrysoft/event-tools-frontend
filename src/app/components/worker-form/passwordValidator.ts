import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  }
}