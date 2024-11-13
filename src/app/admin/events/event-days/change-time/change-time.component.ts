import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
import { Subject, takeUntil } from "rxjs";
import { WorkTimeComponent } from "../../../../components/work-time/work-time.component";
import { getTimeFromDataTimeString } from "../../../../utils/date";

@Component({
  selector: "app-change-time",
  standalone: true,
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
  destroy = new Subject();
  canSend = signal<boolean>(false);
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    const startHour = getTimeFromDataTimeString(this.data.startTime);
    const endHour = getTimeFromDataTimeString(this.data.endTime);

    this.changeTimeForm = new FormGroup<ChangeTimeForm>({
      startTime: new FormControl(this.data.startTime, Validators.required),
      endTime: new FormControl(this.data.endTime, Validators.required),
      startHour: new FormControl(startHour, Validators.required),
      endHour: new FormControl(endHour, Validators.required),
    });
  }

  ngOnInit(): void {
    this.changeTimeForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((status) => {
        this.canSend.set(status === "VALID" && this.changeTimeForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

interface ChangeTimeForm {
  startTime: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
  startHour: FormControl<string | null>;
  endHour: FormControl<string | null>;
}
