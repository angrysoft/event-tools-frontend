import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function datesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const from = control.get("from");
    const to = control.get("to");
    if (from?.value.setHours(0,0,0) > to?.value.setHours(0,0,0)) {
      to?.setErrors({ matchError: "Zakończenie nie może być przed rozpoczęciem" });
      return { match: true };
    }
    to?.setErrors(null);
    return null;
  };
}
