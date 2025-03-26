import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from "@angular/core";
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
import { ZoomActionsComponent } from "../zoom-actions/zoom-actions.component";

@Component({
  selector: "app-calendar-view",
  imports: [
    LoaderComponent,
    DateChangerComponent,
    AddButtonComponent,
    MonthComponent,
    ZoomActionsComponent,
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
  showZoom = input<boolean>(false);
  currentDate: string = "";
  fontSize = signal<number>(1);
  reloadCount = signal(0);
  root: HTMLElement;

  constructor() {
    effect(() => {
      const size = this.fontSize();
      untracked(() => {
        this.root.style.setProperty("--calendar-font-size", `${size}rem`);
        localStorage.setItem("calendarFontSize", size.toString());
      });
    });

    this.root = document.querySelector(":root") as HTMLElement;
    const fSize = localStorage.getItem("calendarFontSize");

    if (fSize) this.fontSize.set(Number(fSize));
  }

  getTrack(month: string) {
    return `${month}-${this.reloadCount()}`;
  }

  loadData() {
    this.workerDayService.getCalendar(this.currentDate).subscribe((resp) => {
      if (resp.ok) {
        console.log(resp.data);
        this.reloadCount.update((reload) => reload + 1);
        this.months.set(resp.data);
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

  handleZoom(zoomAction: string) {
    if (zoomAction === "in" && this.fontSize() < 3)
      this.fontSize.update((s) => s + 0.1);
    else if (zoomAction === "out" && this.fontSize() > 0.7)
      this.fontSize.update((s) => s - 0.1);
    else if (zoomAction === "reset") this.fontSize.set(1);
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
        break;
      case "load":
        if (menuData.data === 1)
          document.getElementById("1")?.scrollIntoView(true);
        break;
    }
  }
}
