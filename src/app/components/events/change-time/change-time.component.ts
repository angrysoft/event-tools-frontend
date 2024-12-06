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
import { getDateTime } from "../../../utils/date";
import { WorkTimeComponent } from "../../work-time/work-time.component";

@Component({
  selector: "app-change-time",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    WorkTimeComponent,
  ],
  templateUrl: "./change-time.component.html",
  styleUrl: "./change-time.component.scss",
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeTimeComponent {
  changeTimeForm: FormGroup<ChangeTimeForm>;
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.changeTimeForm = new FormGroup<ChangeTimeForm>({
      startTime: new FormControl(
        getDateTime(this.data.startTime),
        Validators.required
      ),
      endTime: new FormControl(
        getDateTime(this.data.endTime),
        Validators.required
      ),
    });
  }
}

interface ChangeTimeForm {
  startTime: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
}
