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

@Component({
  selector: "app-duplicate-days",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerModule,
  ],
  templateUrl: "./duplicate-days.component.html",
  styleUrl: "./duplicate-days.component.scss",
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateDaysComponent {
  duplicateDaysForm: FormGroup<DuplicateDaysFrom>;
  destroy = new Subject();
  canSend = signal<boolean>(false);
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    const startDate = new Date(this.data.startTime);
    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 1);
    this.duplicateDaysForm = new FormGroup<DuplicateDaysFrom>({
      start: new FormControl(startDate, Validators.required),
      end: new FormControl(endDate, Validators.required),
    });
  }

  ngOnInit(): void {
    this.duplicateDaysForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((status) => {
        this.canSend.set(status === "VALID" && this.duplicateDaysForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

interface DuplicateDaysFrom {
  start: FormControl<Date | null>;
  end: FormControl<Date | null>;
}
