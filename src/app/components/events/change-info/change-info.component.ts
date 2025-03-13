import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-change-info",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: "./change-info.component.html",
  styleUrl: "./change-info.component.scss",
})
export class ChangeInfoComponent {
  changeInfoForm: FormGroup<ChangeInfoForm>;
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.changeInfoForm = new FormGroup<ChangeInfoForm>({
      info: new FormControl(this.data.info, Validators.required),
    });
  }
}

interface ChangeInfoForm {
  info: FormControl<string | null>;
}
