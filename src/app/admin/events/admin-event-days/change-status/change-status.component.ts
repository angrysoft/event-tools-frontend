import { KeyValuePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-change-status",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    KeyValuePipe,
  ],
  templateUrl: "./change-status.component.html",
  styleUrl: "./change-status.component.scss",
})
export class ChangeStatusComponent {
  changeStatusForm: FormGroup<ChangeStatusForm>;
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.changeStatusForm = new FormGroup<ChangeStatusForm>({
      status: new FormControl(null, Validators.required),
      changeAll: new FormControl(false),
    });
  }
}

interface ChangeStatusForm {
  status: FormControl<string | null>;
  changeAll: FormControl<boolean | null>;
}
