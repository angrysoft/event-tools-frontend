import { DatePipe, JsonPipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  signal,
  untracked,
  ViewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTable, MatTableModule } from "@angular/material/table";
import { WorkerDaysService } from "../../admin/services/worker-days.service";
import { Schedule } from "../../models/schedule";
import { ColorPipe } from "../../pipes/color.pipe";
import { RowPipe } from "../../pipes/row.pipe";
import { dateToString } from "../../utils/date";
import { LoaderComponent } from "../loader/loader.component";
import { ScheduleDataSource } from "./datasource";

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LoaderComponent,
    DatePipe,
    MatTableModule,
    JsonPipe,
    RowPipe,
    ColorPipe
],
  templateUrl: "./schedule.component.html",
  styleUrl: "./schedule.component.scss",
})
export class ScheduleComponent implements AfterViewInit {
  private readonly service = inject(WorkerDaysService);
  schedules = signal<Schedule | null>(null);
  currentDate: Date;
  dataSource!: ScheduleDataSource;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor() {
    this.dataSource = new ScheduleDataSource(this.service);
    this.currentDate = new Date();
    this.currentDate.setDate(1);
    this.service
      .getSchedule(20, 0, dateToString(new Date()))
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules.set(resp.data);
        }
      });

    effect(() => {
      const workerSchedules = this.schedules()?.workerSchedules;
      untracked(() => {
        if (workerSchedules) {
          this.dataSource.loadData(workerSchedules);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

  get columnNames() {
    return [
      "workerName",
      ...(this.schedules()?.days.map((el) => el.day.toString()) ?? []),
    ];
  }

  prevMonth() {
    console.log("prev");
  }

  nextMonth() {
    console.log("next");
  }

  onClick(row: any) {
    console.log(row);
  }
}
