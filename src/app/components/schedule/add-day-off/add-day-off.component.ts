import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Subject, takeUntil } from "rxjs";

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDayOffComponent {
  daysOffForm: FormGroup<DaysOffForm>;
  destroy = new Subject();
  canSend = signal<boolean>(false);
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    const startDate = new Date(this.data.startDate);
    const endDate = new Date(startDate);
    
    this.daysOffForm = new FormGroup<DaysOffForm>({
      start: new FormControl(startDate, Validators.required),
      end: new FormControl(endDate, Validators.required),
    });
  }

  ngOnInit(): void {
    this.canSend.set(this.daysOffForm.valid);

    this.daysOffForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((status) => {
        this.canSend.set(status === "VALID" && this.daysOffForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

interface DaysOffForm {
  start: FormControl<Date | null>;
  end: FormControl<Date | null>;
}
