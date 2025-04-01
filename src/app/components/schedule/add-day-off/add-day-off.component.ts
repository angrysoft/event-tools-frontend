import {
  ChangeDetectionStrategy,
  Component,
  inject
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-add-day-off",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerModule,
  ],
  templateUrl: "./add-day-off.component.html",
  styleUrl: "./add-day-off.component.scss",
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDayOffComponent {
  daysOffForm: FormGroup<DaysOffForm>;
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    const startDate = new Date(this.data.startDate);
    const endDate = new Date(startDate);

    this.daysOffForm = new FormGroup<DaysOffForm>({
      start: new FormControl(startDate, Validators.required),
      end: new FormControl(endDate, Validators.required),
    });
  }
}

interface DaysOffForm {
  start: FormControl<Date | null>;
  end: FormControl<Date | null>;
}
