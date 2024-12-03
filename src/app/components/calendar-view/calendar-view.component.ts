import { Component, inject, input, signal } from "@angular/core";
import { WorkerDaysService } from "../../services/worker-days.service";
import { CalendarDay } from "../../models/calendar";
import { DateChangerComponent } from "../date-changer/date-changer.component";
import { LoaderComponent } from "../loader/loader.component";
import { getTextColor } from "../../utils/colors";
import { Router } from "@angular/router";

@Component({
  selector: "app-calendar-view",
  imports: [LoaderComponent, DateChangerComponent],
  templateUrl: "./calendar-view.component.html",
  styleUrl: "./calendar-view.component.scss",
})
export class CalendarViewComponent {
  private readonly router = inject(Router);
  private readonly workerDayService = inject(WorkerDaysService);
  loading = signal<boolean>(true);
  days = signal<CalendarDay[]>([]);
  eventUrl = input<string>("/admin/events");
  currentDate: string = "";
  schedules: any;
  size: any;

  weekDayNames = ["PON.", "WT.", "ŚR.", "CZW.", "PT.", "SOB.", "NIEDZ."];

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
    this.workerDayService.getCalendar(this.currentDate).subscribe((resp) => {
      if (resp.ok) {
        const newDays: CalendarDay[] = [];
        const dayOffset = weekDays.indexOf(resp.data.at(0)?.weekName ?? "");
        if (dayOffset < 0) return;
        for (let i = 0; i < dayOffset; i++) {
          newDays.push({
            day: i * -1,
            weekName: "",
            events: [],
          });
        }

        newDays.push(...resp.data);
        this.days.set(newDays);
        this.loading.set(false);
      }
    });
  }

  dateChange(date: string) {
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

  getTextColor(color: string) {
    return getTextColor(color);
  }

  goToEvent(event: number) {
    this.router.navigateByUrl(`${this.eventUrl()}/${event}`);
  }

  getDay(idx: number) {
    return this.weekDayNames.at(idx);
  }
}
