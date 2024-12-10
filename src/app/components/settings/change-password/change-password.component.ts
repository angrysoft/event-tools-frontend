import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { passwordValidator } from "../../../validators/passwordValidator";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { WorkersService } from "../../../services/workers.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-change-password",
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.scss",
})
export class ChangePasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly service = inject(WorkersService);
  passwordChanged = false;

  changePasswordGroup: FormGroup<ChangePasswordForm>;
  constructor() {
    this.changePasswordGroup = new FormGroup<ChangePasswordForm>(
      {
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        password2: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      passwordValidator()
    );
  }

  save() {
    const passwordPayload = this.changePasswordGroup.value;
    if (!passwordPayload.password && !passwordPayload.password2) return;
    
    this.service.changePassword(passwordPayload).subscribe((resp) => {
      if (resp.ok) {
        this.passwordChanged = true;
        this.auth.logout();
      } else this.service.showError(resp);
    });
  }
}

interface ChangePasswordForm {
  password: FormControl<string | null>;
  password2: FormControl<string | null>;
}
