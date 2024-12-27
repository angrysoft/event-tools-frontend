import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { dateToString } from "../../../utils/date";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
  selector: "app-change-worker",
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: "./change-worker.component.html",
  styleUrl: "./change-worker.component.scss",
  providers: [provideNativeDateAdapter()],
})
export class ChangeWorkerComponent {
  changeWorkerForm: FormGroup<ChangeWorkerForm>;
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    let date = null;
    if (this.data.startDate) date = new Date(this.data.startDate);
    this.changeWorkerForm = new FormGroup<ChangeWorkerForm>({
      from: new FormControl(date, Validators.required),
      to: new FormControl(date, Validators.required),
    });
    this.changeWorkerForm.disable();
  }

  get from() {
    return dateToString(
      this.changeWorkerForm.controls.from.value ?? new Date()
    );
  }

  get to() {
    return dateToString(this.changeWorkerForm.controls.to.value ?? new Date());
  }

  inRangeChange(ev: {checked: boolean}) {
    if (ev.checked) {
      this.changeWorkerForm.enable();
      this.changeWorkerForm.enable();
    } else {
      this.changeWorkerForm.disable();
      this.changeWorkerForm.disable();
    }
  }
}

interface ChangeWorkerForm {
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}
