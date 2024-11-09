import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { dateToString } from "../../../utils/date";
import {
  DuplicateDaysPayload,
  EventDay,
  WorkerDay,
  WorkerDayStatusPayload,
} from "../../models/events";
import { EventDaysService } from "../../services/event-days.service";
import { WorkerDaysService } from "../../services/worker-days.service";
import { AddDayComponent } from "./add-day/add-day.component";
import { WorkerDayComponent } from "./worker-day/worker-day.component";
import { ChangeTimeComponent } from "./change-time/change-time.component";
import { DuplicateDaysComponent } from "./duplicate-days/duplicate-days.component";
import { ChangeStatusComponent } from "./change-status/change-status.component";
import { LoaderComponent } from "../../../components/loader/loader.component";

@Component({
  selector: "app-event-days",
  standalone: true,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatIcon,
    MatDividerModule,
    RouterLink,
    DatePipe,
    WorkerDayComponent,
    LoaderComponent,
  ],
  templateUrl: "./event-days.component.html",
  styleUrl: "./event-days.component.scss",
})
export class EventDaysComponent implements AfterViewInit {
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(EventDaysService);
  workerDayService = inject(WorkerDaysService);

  statuses = signal<{ [key: string]: string }>({});
  eventDays = signal<EventDay[]>([]);
  loading = signal<boolean>(true);
  tabIdx = new FormControl(1);
  name = this.route.snapshot.queryParamMap.get("name");
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  backTo = `/admin/events/${this.eventId}`;
  selection = new SelectionModel<WorkerDay>(true, []);
  dayId = -1;

  constructor() {
    this.workerDayService.getStatuses().subscribe((resp) => {
      if (resp.ok) this.statuses.set(resp.data);
    });
    this.lodaDays();
  }

  ngAfterViewInit(): void {
    this.tabIdx.setValue(1);
  }

  private lodaDays() {
    this.service.getDays(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventDays.set(resp.data);
      }
      this.loading.set(false);
    });
  }

  tabChange(tab: any) {
    console.dir(tab);
    this.dayId = this.eventDays().at(tab.index)?.id ?? -1;
    this.selection.clear();
    this.tabIdx.setValue(tab.index);
    console.log("idx: ", tab);
  }

  get isMultipleSelected() {
    // always return true ?!?!
    //this.selection().isMultipleSelection()
    return this.selection.selected.length !== 1;
  }

  addDay() {
    const addDialog = this.dialog.open(AddDayComponent, { disableClose: true });
    addDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log({
        event: this.eventId,
        startDate: dateToString(result.startDate),
        state: "TEMPLATE",
        info: result.info,
        workerDays: [],
      });
      this.loading.set(true);
      this.service
        .addDay(this.eventId, {
          event: this.eventId,
          startDate: dateToString(result.startDate),
          state: "TEMPLATE",
          info: result.info,
          workerDays: [],
        })
        .subscribe((resp) => {
          if (resp.ok) {
            this.lodaDays();
          }
        });
    });
  }

  delDay() {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: "Czy jesteś pewien że chcesz usunąć jest to operacja nie odwracalna ?",
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loading.set(true);
        this.service.delDay(this.eventId, this.dayId).subscribe((resp) => {
          if (resp.ok) {
            this.lodaDays();
          }
        });
      }
    });
  }

  addWorkers() {
    this.router.navigateByUrl(
      `/admin/events/${this.eventId}/day/${this.dayId}?tab=${this.tabIdx.value}`,
    );
  }

  duplicateDay() {
    const duplicateDialog = this.dialog.open(DuplicateDaysComponent, {
      data: {
        startTime: this.eventDays().at(this.tabIdx.value ?? 0)?.startDate,
      },
      maxWidth: "95vw",
    });
    duplicateDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const workerDays: number[] = [];
      this.selection.selected.forEach((s) => {
        if (s.id) workerDays.push(s.id);
      });

      const payload: DuplicateDaysPayload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
        workerDays: workerDays,
      };

      this.workerDayService
        .duplicateDays(this.eventId, this.dayId, payload)
        .subscribe((resp) => {
          if (resp.ok) {
            this.lodaDays();
            this.selection.clear();
          } else this.workerDayService.showError(resp);
        });
    });
  }

  editTime() {
    const firstDay = this.selection.selected.at(0);

    const timeDialog = this.dialog.open(ChangeTimeComponent, {
      data: {
        startTime: firstDay?.startTime,
        endTime: firstDay?.endTime,
      },
      maxWidth: "95vw",
    });

    timeDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const workerDays: any = {};
      this.selection.selected.forEach((sel) => {
        if (sel.id) workerDays[sel.id] = sel.workerName;
      });
      this.workerDayService
        .changeTime(this.eventId, this.dayId, {
          workerDays: workerDays,
          startTime: result.startTime,
          endTime: result.endTime,
        })
        .subscribe((resp) => {
          if (resp.ok) {
            this.lodaDays();
            this.selection.clear();
          } else this.workerDayService.showError(resp);
        });
    });
  }

  removeWorkersDays() {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);

        this.workerDayService
          .removeWorkersDays(
            this.eventId,
            this.dayId,
            this.selection.selected
              .map((wd) => wd.id)
              .filter((w) => typeof w === "number"),
          )
          .subscribe((resp) => {
            if (resp.ok) {
              this.lodaDays();
              this.selection.clear();
            }
          });
      }
    });
  }

  changeWorker() {}

  changeStatus() {
    const changeStatusDialog = this.dialog.open(ChangeStatusComponent, {
      data: {
        statuses: this.statuses(),
      },
      maxWidth: "95vw",
    });

    changeStatusDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const payload: WorkerDayStatusPayload = {
        status: result.status,
        eventDays: [],
      };

      const workerDaysToChangeStatus: number[] = [];
      if (result.changeAll) {
        this.eventDays().forEach((d) => {
          if (d.id) workerDaysToChangeStatus.push(d.id);
        });
      } else {
        workerDaysToChangeStatus.push(this.dayId);
      }

      payload.eventDays = workerDaysToChangeStatus;

      this.workerDayService
        .changeStatus(this.eventId, payload)
        .subscribe((resp) => {
          if (resp.ok) {
            this.lodaDays();
            this.selection.clear();
          } else this.workerDayService.showError(resp);
        });
    });
  }

  editRatesAndAddons() {
    this.router.navigateByUrl(
      `/admin/events/${this.eventId}/day/${this.dayId}/change?tab=${this.tabIdx.value}`,
      {
        state: {
          selected: this.selection.selected.slice(),
        },
      },
    );
  }

  @HostListener("document:keydown.Alt.a", ["$event"])
  handleAdd() {
    this.addDay();
  }
}
