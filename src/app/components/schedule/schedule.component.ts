import { DatePipe } from "@angular/common";
import {
  Component,
  effect,
  inject,
  output,
  signal
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { WorkerDaysService } from "../../admin/services/worker-days.service";
import { Schedule, WorkerDaySchedule } from "../../models/schedule";
import { dateToString } from "../../utils/date";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LoaderComponent,
    DatePipe,
  ],
  templateUrl: "./schedule.component.html",
  styleUrl: "./schedule.component.scss",
})
export class ScheduleComponent {
  private readonly service = inject(WorkerDaysService);

  schedules = signal<Schedule | null>(null);
  loading = signal<boolean>(true);
  action = output<WorkerDaySchedule>();
  currentDate: Date;

  constructor() {
    this.currentDate = new Date();
    this.currentDate.setDate(1);
    this.service
      .getSchedule(30, 0, dateToString(new Date()))
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules.set(resp.data);
          this.loading.set(false);
        }
      });

    effect(() => {
      console.log(this.schedules());
    });
  }

  get header() {
    return [
      "workerName",
      ...(this.schedules()?.days.map((el) => el.day.toString()) ?? []),
    ];
  }

  get days() {
    return this.schedules()?.days ?? [];
  }

  get cssCols() {
    return `repeat(${this.header.length}, auto)`;
  }

  get rows() {
    return this.schedules()?.workerSchedules ?? [];
  }

  prevMonth() {
    console.log("prev");
  }

  nextMonth() {
    console.log("next");
  }

  onClick(data: any) {
    this.action.emit(data);
    console.log(data);
  }
}
