import { DatePipe } from "@angular/common";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { dateTimeToString } from "../../utils/date";

@Component({
    selector: "app-work-time",
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        DatePipe,
    ],
    templateUrl: "./work-time.component.html",
    styleUrl: "./work-time.component.scss"
})
export class WorkTimeComponent implements AfterContentInit, OnDestroy {
  destroy = new Subject();
  startTime = input.required<FormControl<Date | null | string>>();
  endTime = input.required<FormControl<Date | null | string>>();
  startHour = input.required<FormControl<string | null>>();
  endHour = input.required<FormControl<string | null>>();

  ngAfterContentInit(): void {
    this.startHour()
      .valueChanges.pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((value) => {
        this.setDateTimeForControl(this.startTime(), value ?? "");
      });

    this.endHour()
      .valueChanges.pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((value) => {
        this.setDateTimeForControl(this.endTime(), value ?? "");
      });

    this.endTime()
      .valueChanges.pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.setDateTimeForControl(this.endTime(), this.endHour().value ?? "");
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  private setDateTimeForControl(control: FormControl, value: string) {
    const t = RegExp(/^(\d+):(\d+)/).exec(value ?? "");

    if (t?.length === 3) {
      let controlValue = control.value;
      if (typeof controlValue === "string") {
        controlValue = new Date(control.value?.toString() as string);
      }
      controlValue.setHours(Number(t.at(1)));
      controlValue.setMinutes(Number(t.at(2)));

      control.setValue(dateTimeToString(controlValue), { emitEvent: false });
    }
  }
}
