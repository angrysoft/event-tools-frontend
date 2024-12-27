import { Component, inject, input, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CalendarDay } from "../../models/calendar";
import { MenuAction } from "../../models/menu";
import { WorkerDaysService } from "../../services/worker-days.service";
import { dateToString } from "../../utils/date";
import { AddButtonComponent } from "../add-button/add-button.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { DateChangerComponent } from "../date-changer/date-changer.component";
import { LoaderComponent } from "../loader/loader.component";
import { AddDayOffComponent } from "../schedule/add-day-off/add-day-off.component";
import { CalendarItemComponent } from "./calendar-item/calendar-item.component";

@Component({
  selector: "app-calendar-view",
  imports: [
    LoaderComponent,
    DateChangerComponent,
    CalendarItemComponent,
    AddButtonComponent,
  ],
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
  showAdd = input<boolean>(false);

  currentDate: string = "";

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
        const headDays: CalendarDay[] = [];
        const tailDays: CalendarDay[] = [];
        const dayOffset = weekDays.indexOf(resp.data.at(0)?.weekName ?? "");
        let track = -1;
        if (dayOffset < 0) return;
        for (let i = 0; i < dayOffset; i++) {
          headDays.push({
            day: track,
            weekName: "",
            events: [],
          });
          track--;
        }
        headDays.push(...resp.data);

        const dayTail = Math.ceil(headDays.length / 7) * 7 - headDays.length;
          
        for (let i = 0; i < dayTail; i++) {
          tailDays.push({
            day: track,
            weekName: "",
            events: [],
          });
          track--;
        }
        headDays.push(...tailDays);
        this.days.set(headDays);
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

  addDayOff() {
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

  goToEvent(event: number) {
    this.router.navigateByUrl(`${this.eventUrl()}/${event}`);
  }

  handleActions(menuData: MenuAction) {
    switch (menuData.action) {
      case "remove":
        this.removeDayOff(menuData.data as number);
        break;
      case "goTo":
        this.goToEvent(menuData.data as number);
    }
  }
}
