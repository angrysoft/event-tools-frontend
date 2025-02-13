import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { WorkerBase } from "../../models/worker";
import {
  ChangeWorkerInDatesPayload,
  ChangeWorkerPayload,
} from "../../models/events";
import { DayId, MenuAction, WorkerAction } from "../../models/menu";
import {
  Schedule,
  ScheduleAction,
  WorkerDaySchedule,
} from "../../models/schedule";
import { WorkerDaysService } from "../../services/worker-days.service";
import { getTextColor } from "../../utils/colors";
import { dateToString } from "../../utils/date";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { DateChangerComponent } from "../date-changer/date-changer.component";
import { ChangeWorkerComponent } from "../events/change-worker/change-worker.component";
import { DuplicateDaysComponent } from "../events/duplicate-days/duplicate-days.component";
import { LoaderComponent } from "../loader/loader.component";
import { WorkerChooserConfig } from "../worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../worker-chooser/worker-chooser.component";
import { AddDayOffComponent } from "./add-day-off/add-day-off.component";
import { DayOffComponent } from "./day-off/day-off.component";
import { EmptyDayComponent } from "./empty-day/empty-day.component";
import { EventDayComponent } from "./event-day/event-day.component";
import { EventDaysService } from "../../services/event-days.service";
import { ChangeCommentComponent } from "../events/change-comment/change-comment.component";
import { DateChangerRangeComponent } from "../date-changer-range/date-changer-range.component";

@Component({
  selector: "app-schedule",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LoaderComponent,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DateChangerComponent,
    DayOffComponent,
    EventDayComponent,
    EmptyDayComponent,
    DateChangerRangeComponent,
  ],
  templateUrl: "./schedule.component.html",
  styleUrl: "./schedule.component.scss",
})
export class ScheduleComponent implements OnDestroy, AfterViewInit {
  private readonly workerDayService = inject(WorkerDaysService);
  private readonly eventDayService = inject(EventDaysService);
  private readonly dialog = inject(MatDialog);
  observer!: IntersectionObserver;

  schedules = signal<Schedule>({
    workerSchedules: [],
    offset: 0,
    size: 0,
    days: [],
    total: 0,
  });
  admin = input<boolean>(false);
  loading = signal<boolean>(true);
  action = output<ScheduleAction>();
  offset: number = 0;
  size: number = 50;
  readonly end = viewChild.required<ElementRef<HTMLDivElement>>("end");
  currentDate: string = "";
  toDate: string | null = null;

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMore();
        }
      });
    }, options);
    this.end().nativeElement.style.display = "none";
    this.observer.observe(this.end().nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  reloadData() {
    let size = this.size;
    if (this.offset > 0) {
      size = this.schedules().workerSchedules.length;
      this.offset = size - this.size;
    }
    this.loadData(size, 0);
  }

  loadData(size: number, offset: number) {
    this.loading.set(true);

    this.workerDayService
      .getSchedule(size, offset, this.currentDate, this.toDate)
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules.set(resp.data);
          this.schedules().size = this.size;
          this.loading.set(false);
          this.end().nativeElement.style.gridColumn = `1 / span ${this.cols}`;
          this.end().nativeElement.style.display = "block";
        }
      });
  }

  loadMore() {
    const newOffset = this.offset + this.size;
    if (newOffset > this.schedules().total) return;
    this.loading.set(true);
    this.end().nativeElement.style.display = "none";
    this.offset = newOffset;
    this.workerDayService
      .getSchedule(this.size, this.offset, this.currentDate)
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules().workerSchedules.push(...resp.data.workerSchedules);
          this.schedules().total = resp.data.total;
          this.loading.set(false);
        }
        this.end().nativeElement.style.display = "block";
        this.loading.set(false);
      });
  }

  get cols() {
    return this.schedules().days.length + 2;
  }

  get days() {
    return this.schedules()?.days ?? [];
  }

  get cssCols() {
    return `repeat(${this.cols}, auto)`;
  }

  get rows() {
    return this.schedules().workerSchedules;
  }

  dateChange(date: string) {
    this.currentDate = date;
    this.offset = 0;
    this.loadData(this.size, this.offset);
  }

  dateRangeChange(dateRange: { from: string; to: string }) {
    this.currentDate = dateRange.from;
    this.toDate = dateRange.to;
    this.offset = 0;
    this.loadData(this.size, this.offset);
  }

  goToWorker(id: number) {
    this.action.emit({ action: "worker", data: { workerId: id } });
  }

  removeDay(data: WorkerDaySchedule) {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);

        this.workerDayService
          .removeWorkersDays(data.eventId, data.eventDay, [data.id])
          .subscribe((resp) => {
            if (resp.ok) {
              this.reloadData();
            }
          });
      }
    });
  }

  addDayOff(
    worker: { workerName: string; id: number },
    data: { date: string | Date }
  ) {
    const dayOffDialog = this.dialog.open(AddDayOffComponent, {
      data: {
        startDate: data.date,
      },
      maxWidth: "95vw",
    });
    dayOffDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const payload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
        worker: worker.id,
        workerName: worker.workerName,
      };

      this.workerDayService.addDaysOff(payload).subscribe((resp) => {
        if (resp.ok) {
          this.reloadData();
        } else this.workerDayService.showError(resp);
        this.loading.set(false);
      });
    });
  }

  duplicateDay(data: WorkerDaySchedule) {
    const duplicateDialog = this.dialog.open(DuplicateDaysComponent, {
      data: {
        startTime: data.startDate,
      },
      maxWidth: "95vw",
    });
    duplicateDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const payload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
        workerDays: [data.id],
      };

      this.workerDayService
        .duplicateDays(data.eventId, data.eventDay, payload)
        .subscribe((resp) => {
          if (resp.ok) {
            this.reloadData();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
    });
  }

  changeWorker(data: WorkerDaySchedule) {
    const config: WorkerChooserConfig = {
      single: true,
      search: true,
    };
    const chooseNewWorkerDialog = this.dialog.open(WorkerChooserComponent, {
      data: config,
      maxWidth: "95vw",
    });

    let newWorker: WorkerBase | null = null;

    chooseNewWorkerDialog.afterClosed().subscribe((result) => {
      if (result && result.length > 0) {
        newWorker = result.at(0);
        if (newWorker?.id === data.worker) {
          this.workerDayService.showMsg(
            "Nie można zmienić na tego samego pracownika"
          );
          return;
        }
        const changeWorkerDialog = this.dialog.open(ChangeWorkerComponent, {
          data: { startDate: data.startDate },
        });

        changeWorkerDialog.afterClosed().subscribe((result) => {
          if (!result.state) return;

          this.loading.set(true);
          if (result.inRange && newWorker) {
            const payload: ChangeWorkerInDatesPayload = {
              newWorker: newWorker.id,
              newWorkerName: `${newWorker.firstName} ${newWorker.lastName}`,
              oldWorker: data.worker,
              from: result.from,
              to: result.to,
            };
            this.workerDayService
              .changeWorkerInDates(data.eventId, payload)
              .subscribe((resp) => {
                if (resp.ok) {
                  this.reloadData();
                } else this.workerDayService.showError(resp);
                this.loading.set(false);
              });
          } else if (newWorker) {
            const payload: ChangeWorkerPayload = {
              worker: newWorker.id ?? -1,
              workerName: `${newWorker.firstName} ${newWorker.lastName}`,
              workerDay: data.id,
            };

            this.workerDayService
              .changeWorker(data.eventId, data.eventDay, payload)
              .subscribe((resp) => {
                if (resp.ok) {
                  this.reloadData();
                } else this.workerDayService.showError(resp);
                this.loading.set(false);
              });
          }
        });
      }
    });
  }

  removeDayOff(data: DayId) {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);
        this.workerDayService.removeDayOff(data.id).subscribe((resp) => {
          if (resp.ok) {
            this.reloadData();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
      }
    });
  }

  rejectDayOff(data: DayId) {
    this.loading.set(true);
    this.workerDayService.rejectDayOff(data.id).subscribe((resp) => {
      if (resp.ok) {
        this.reloadData();
      } else this.workerDayService.showError(resp);
      this.loading.set(false);
    });
  }

  acceptDayOff(data: DayId) {
    this.loading.set(true);
    this.workerDayService.acceptDayOff(data.id).subscribe((resp) => {
      if (resp.ok) {
        this.reloadData();
      } else this.workerDayService.showError(resp);
      this.loading.set(false);
    });
  }

  changeComment(data: WorkerDaySchedule) {
    const changeCommentDialog = this.dialog.open(ChangeCommentComponent, {
      data: { comment: data.comment },
      maxWidth: "95vw",
    });

    changeCommentDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.eventDayService
          .changeComment(data.eventId, data.eventDay, result.comment)
          .subscribe((resp) => {
            if (resp.ok) {
              this.reloadData();
            } else this.workerDayService.showError(resp);
            this.loading.set(false);
          });
      }
    });
  }

  checkDayOff(data: WorkerDaySchedule) {
    return `${data.id}.${data.startDate}.${data.accepted}`;
  }

  getTextColor(color: string) {
    return getTextColor(color);
  }

  dayOffAction(menuData: MenuAction) {
    switch (menuData.action) {
      case "accept":
        this.acceptDayOff(menuData.data as DayId);
        break;
      case "remove":
        this.removeDayOff(menuData.data as DayId);
        break;
      case "reject":
        this.rejectDayOff(menuData.data as DayId);
        break;
    }
  }

  eventDayAction(menuData: MenuAction) {
    switch (menuData.action) {
      case "duplicate":
        this.duplicateDay(menuData.data as WorkerDaySchedule);
        break;
      case "remove":
        this.removeDay(menuData.data as WorkerDaySchedule);
        break;
      case "changeWorker":
        this.changeWorker(menuData.data as WorkerDaySchedule);
        break;
      case "comment":
        this.changeComment(menuData.data as WorkerDaySchedule);
        break;
      case "goto":
        this.action.emit({
          action: "event",
          data: menuData.data as WorkerDaySchedule | { workerId: number },
        });
    }
  }

  emptyDayAction(menuData: MenuAction) {
    if (menuData.action === "addDayOff") {
      const data = menuData.data as WorkerAction;
      this.addDayOff(data.worker, data.data);
    }
  }
}
