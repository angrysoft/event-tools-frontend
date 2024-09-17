import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password");
    const password2 = control.get("password2");
    const passwordRequiredError = Validators.required(
      password as AbstractControl,
    );
    console.log(password?.value, password2?.value);

    if (passwordRequiredError) {
      return passwordRequiredError;
    }

    const password2RequiredError = Validators.required(
      password2 as AbstractControl,
    );

    if (password2RequiredError) {
      return password2RequiredError;
    }

    if (password?.value !== password2?.value) {
      return {
        match_error: true
      }
    }
    
    return null;
  };
}
