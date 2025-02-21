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
import { MonthComponent } from "./month/month.component";

@Component({
  selector: "app-calendar-view",
  imports: [
    LoaderComponent,
    DateChangerComponent,
    AddButtonComponent,
    MonthComponent,
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
  months = signal<{ month: string; days: CalendarDay[] }[]>([]);
  
  eventUrl = input<string>("/admin/events");
  eventUrlData = input<{ [key: string]: string } | undefined>();
  showAdd = input<boolean>(false);

  currentDate: string = "";

  loadData() {
    this.workerDayService.getCalendar(this.currentDate).subscribe((resp) => {
      if (resp.ok) {
        const data: { month: string; days: CalendarDay[] }[] = [];

        data.push({
          month: this.currentDate,
          days: resp.data,
        });
        
        data.push({
          month: "blabla",
          days: resp.data,
        });

        this.months.set(data);
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
    if (this.eventUrlData()) {
      this.router.navigateByUrl(`${this.eventUrl()}/${event}`, {
        state: this.eventUrlData(),
      });
    } else {
      this.router.navigateByUrl(`${this.eventUrl()}/${event}`);
    }
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
