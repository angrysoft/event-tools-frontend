import { AfterViewInit, Component, OnDestroy, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { dateToString } from "../../utils/date";

@Component({
  selector: "app-date-changer",
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: "./date-changer.component.html",
  styleUrl: "./date-changer.component.scss",
})
export class DateChangerComponent implements OnDestroy {
  dateFrom: FormGroup<DateForm>;
  dateChanged = output<string>();
  destroy = new Subject();

  constructor() {
    const date = new Date();
    date.setDate(1);

    this.dateFrom = new FormGroup<DateForm>({
      month: new FormControl(date.getMonth(), Validators.required),
      year: new FormControl(date.getFullYear(), [
        Validators.required,
        Validators.min(2024),
        Validators.minLength(4),
      ]),
    });

    this.dateFrom.statusChanges
      .pipe(debounceTime(500), takeUntil(this.destroy))
      .subscribe((status) => {
        if (status === "VALID") {
          const date = new Date();
          date.setDate(1);
          date.setFullYear(this.dateFrom.controls.year.value ?? 0);
          date.setMonth(this.dateFrom.controls.month.value ?? 0);
          this.dateChanged.emit(dateToString(date));
        }
      });
  }

  ngAfterViewInit(): void {
    const date = new Date();
    date.setDate(1);
    this.dateChanged.emit(dateToString(date));
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  nextMonth() {
    this.changeMonth(true);
  }

  prevMonth() {
    this.changeMonth(false);
  }

  changeMonth(add: boolean) {
    const month = this.dateFrom.controls.month.value;
    const year = this.dateFrom.controls.year.value;
    if (month === null || year === null) return;

    const newDate = new Date();
    newDate.setDate(1);
    newDate.setFullYear(year);
    if (add) newDate.setMonth(month + 1);
    else newDate.setMonth(month - 1);
    this.dateFrom.controls.month.setValue(newDate.getMonth());
    this.dateFrom.controls.year.setValue(newDate.getFullYear());
  }
}

interface DateForm {
  month: FormControl<number | null>;
  year: FormControl<number | null>;
}