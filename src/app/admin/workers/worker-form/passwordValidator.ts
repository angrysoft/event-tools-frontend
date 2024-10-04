import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password");
    const password2 = control.get("password2");

    if (password?.value !== password2?.value) {
      password2?.setErrors({ matchError: "Hasła się różnią" });
    }

    return null;
  };
}
