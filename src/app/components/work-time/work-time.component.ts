import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { Subject } from "rxjs";

@Component({
  selector: "app-work-time",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./work-time.component.html",
  styleUrl: "./work-time.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class WorkTimeComponent {
  destroy = new Subject();
  startTime = input.required<FormControl<Date | null>>();
  endTime = input.required<FormControl<Date | null>>();

  get cantRemove() {
    return (
      this.startTime().value?.getDate() === this.endTime().value?.getDate()
    );
  }

  get cantAdd() {
    const startDate = this.startTime().value?.getDate();
    const endDate = this.endTime().value?.getDate();
    if (endDate && startDate) return (endDate - startDate) > 6;
    return true;
  }

  onAddDay() {
    const newTime = this.endTime().value;
    newTime?.setDate(newTime.getDate() + 1);
    this.setEndTimeValue(newTime);
  }

  onRmDay() {
    const newTime = this.endTime().value;
    newTime?.setDate(newTime.getDate() - 1);
    this.setEndTimeValue(newTime);
  }

  setEndTimeValue(newTime: Date | null) {
    this.endTime().setValue(newTime);
    this.endTime().updateValueAndValidity();
    this.endTime().markAsDirty();
  }
}
