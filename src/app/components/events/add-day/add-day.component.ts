import {
  ChangeDetectionStrategy,
  Component
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
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-add-day",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: "./add-day.component.html",
  styleUrl: "./add-day.component.scss",
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDayComponent {
  addDayForm: FormGroup<AddDayForm>;

  constructor() {
    this.addDayForm = new FormGroup<AddDayForm>({
      info: new FormControl(),
      startDate: new FormControl(null, Validators.required),
    });
  }
}

interface AddDayForm {
  info: FormControl<string | null>;
  startDate: FormControl<Date | null>;
}
