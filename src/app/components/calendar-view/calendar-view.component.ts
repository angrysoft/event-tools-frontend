import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from "@angular/core";
import { Router } from "@angular/router";
import { CalendarDay } from "../../models/calendar";
import { WorkerDaysService } from "../../services/worker-days.service";
import { DateChangerComponent } from "../date-changer/date-changer.component";
import { LoaderComponent } from "../loader/loader.component";
import { CalendarItemComponent } from "./calendar-item/calendar-item.component";
import { dateToString } from "../../utils/date";
import { AddDayOffComponent } from "../schedule/add-day-off/add-day-off.component";
import { MatDialog } from "@angular/material/dialog";
import { MenuAction } from "../../models/menu";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-calendar-view",
  imports: [LoaderComponent, DateChangerComponent, CalendarItemComponent],
  templateUrl: "./calendar-view.component.html",
  styleUrl: "./calendar-view.component.scss",
})
export class CalendarViewComponent {
  private readonly router = inject(Router);
  private readonly workerDayService = inject(WorkerDaysService);
  private readonly dialog = inject(MatDialog);

  loading = signal<boolean>(true);
  days = signal<CalendarDay[]>([]);
  eventUrl = input<string>("/admin/events");
  needRefresh = input<boolean>(false);

  currentDate: string = "";
  schedules: any;
  size: any;

  weekDayNames = ["PON.", "WT.", "ŚR.", "CZW.", "PT.", "SOB.", "NIEDZ."];

  constructor() {
    effect(() => {
      const refresh = this.needRefresh();
      untracked(() => {
        if (refresh) {
          this.loadData();
        }
      });
    });
  }

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

  getDay(idx: number) {
    return this.weekDayNames.at(idx);
  }

  addDayOff(data:any) {
    const dayOffDialog = this.dialog.open(AddDayOffComponent, {
      data: {
        startDate: new Date(),
      },
      maxWidth: "95vw",
    });
    dayOffDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);
      const payload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
      };

      this.workerDayService.workerDaysOffRequest(payload).subscribe((resp) => {
        if (resp.ok) {
          this.loadData();
        } else this.workerDayService.showError(resp);
        this.loading.set(false);
      });
    });
  }

  removeDayOff(data: number) {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);
        this.workerDayService.removeDayOff(data).subscribe((resp) => {
          if (resp.ok) {
            this.loadData();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
      }
    });
  }

  handleActions(menuData: MenuAction) {
    switch (menuData.action) {
      case "remove":
        this.removeDayOff(menuData.data);
        break;
      case "addDayOff":
        this.addDayOff(menuData.data);
        break;
    }
  }
}
