import { Component, inject, signal } from "@angular/core";
import { LoaderComponent } from "../loader/loader.component";
import { DateChangerComponent } from "../date-changer/date-changer.component";
import { WorkerDaysService } from "../../admin/services/worker-days.service";
import { CalendarDay } from "../../models/calendar";
import { Day } from "../../models/schedule";

@Component({
  selector: "app-calendar-view",
  imports: [LoaderComponent, DateChangerComponent],
  templateUrl: "./calendar-view.component.html",
  styleUrl: "./calendar-view.component.scss",
})
export class CalendarViewComponent {
  private readonly workerDayService = inject(WorkerDaysService);
  loading = signal<boolean>(true);
  currentDate: string = "";
  days = signal<CalendarDay>({
    days: [],
  });
  schedules: any;
  size: any;

  loadData() {
    const weekDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    this.workerDayService
      .getSchedule(0, 0, this.currentDate)
      .subscribe((resp) => {
        if (resp.ok) {
          const newDays: Day[] = [];
          const dayOffset = weekDays.indexOf(
            resp.data.days.at(0)?.weekName ?? "",
          );
          if (dayOffset < 0) return;
          for (let i = 0; i < dayOffset; i++) {
            newDays.push({
              date: "",
              day: i*-1,
              weekName: "",
            });
          }

          newDays.push(...resp.data.days);
          this.days.set({ days: newDays });
          this.loading.set(false);
        }
      });
  }

  dateChange(date: string) {
    console.log(date);
    this.currentDate = date;
    this.loadData();
  }

  checkDayWeek(weekName: string, _index: number) {
    const weekDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    return weekDays.indexOf(weekName) === _index;
  }
}
