import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import {
  Component,
  HostListener,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import {
  MatTabChangeEvent,
  MatTabGroup,
  MatTabsModule,
} from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { WorkerChooserConfig } from "../../../components/worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../../../components/worker-chooser/worker-chooser.component";
import { dateToString } from "../../../utils/date";

import { AddDayComponent } from "../../../components/events/add-day/add-day.component";
import { ChangeTimeComponent } from "../../../components/events/change-time/change-time.component";
import { ChangeWorkerComponent } from "../../../components/events/change-worker/change-worker.component";
import { DuplicateDaysComponent } from "../../../components/events/duplicate-days/duplicate-days.component";
import { RemoveWorkerDayComponent } from "../../../components/events/remove-worker-day/remove-worker-day.component";
import { WorkerDayComponent } from "../../../components/events/worker-day/worker-day.component";
import {
  ChangeWorkerInDatesPayload,
  ChangeWorkerPayload,
  DuplicateDaysPayload,
  EventDay,
  EventItemDto,
  WorkerDay,
  WorkerDayStatusPayload,
} from "../../../models/events";
import { WorkerDaysService } from "../../../services/worker-days.service";
import { WorkerBase } from "../../../models/worker";
import { EventDaysService } from "../../../services/event-days.service";
import { ChangeStatusComponent } from "./change-status/change-status.component";
import { ChangeInfoComponent } from "../../../components/events/change-info/change-info.component";

@Component({
  selector: "app-admin-event-days",
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
  templateUrl: "./admin-event-days.component.html",
  styleUrl: "./admin-event-days.component.scss",
})
export class AdminEventDaysComponent {
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(EventDaysService);
  workerDayService = inject(WorkerDaysService);

  statuses = signal<{ [key: string]: string }>({});
  eventInfo = signal<EventItemDto>({
    id: 0,
    name: "",
    number: "",
    description: "",
    coordinator: "",
    accountManager: "",
    chief: "",
    editors: [],
    coordinatorId: 0,
  });
  eventDays = signal<EventDay[]>([]);
  loading = signal<boolean>(true);
  dayInfo = signal<string>("");
  firstTime = true;
  tabIdx = Number(this.route.snapshot.queryParamMap.get("tab") ?? 0);
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  backTo = `/admin/events/${this.eventId}`;
  selection = new SelectionModel<WorkerDay>(true, []);
  dayId = -1;
  tabLabel = signal<string>("");
  dayStatus = signal<string>("");
  stateCls = "";

  readonly tabs = viewChild.required(MatTabGroup);

  tableColumns: { name: string; def: string }[] = [
    { name: "select", def: "select" },
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateValue" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];

  constructor() {
    this.workerDayService.getStatuses().subscribe((resp) => {
      if (resp.ok) this.statuses.set(resp.data);
    });
    this.loadDays();
  }

  setTab() {
    if (this.firstTime) {
      let tab = 0;
      const date = this.route.snapshot.queryParamMap.get("date");
      if (date) {
        const idx = this.eventDays().findIndex((d) => d.startDate === date);
        if (idx !== -1) {
          tab = idx;
        }
      } else {
        const idx = Number(this.route.snapshot.queryParamMap.get("tab") ?? 0);
        if (idx) {
          tab = idx;
        }
      }
      this.tabIdx = tab;
      this.firstTime = false;
    }
  }

  private loadDays() {
    this.service.getDays(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventInfo.set(resp.data.info);
        this.eventDays.set(resp.data.eventDays);

        this.setStatus();
      }
      this.loading.set(false);
    });
  }

  tabChange(tab: MatTabChangeEvent) {
    if (!tab) return;
    this.dayId = this.eventDays().at(tab.index)?.id ?? -1;
    this.selection.clear();
    this.tabLabel.set(tab.tab.textLabel);
    this.setStatus();
  }

  setStatus() {
    const day = this.eventDays().at(this.tabIdx);
    if (!day) return;

    const status = this.statuses()[day.state];
    if (status) {
      this.dayStatus.set(status);
      this.stateCls = day.state;
    }

    this.dayInfo.set(day.info ?? "");
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
            this.loadDays();
          } else {
            this.service.showError(resp);
            this.loading.set(false);
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
            this.loadDays();
          } else {
            this.service.showError(resp);
            this.loading.set(false);
          }
        });
      }
    });
  }

  addWorkers() {
    const day = this.eventDays().at(this.tabIdx);
    this.router.navigateByUrl(
      `/admin/events/${this.eventId}/day/${this.dayId}?tab=${this.tabIdx}`,
      {
        state: {
          startDate: day?.startDate,
          backTo: `/admin/events/${this.eventId}/day`,
        },
      }
    );
  }

  duplicateDay() {
    const duplicateDialog = this.dialog.open(DuplicateDaysComponent, {
      data: {
        startTime: this.eventDays().at(this.tabIdx)?.startDate,
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
            this.loadDays();
            this.selection.clear();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
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

      const workerDays:any = {};
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
            this.loadDays();
            this.selection.clear();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
    });
  }

  removeWorkersDays() {
    const delDialog = this.dialog.open(RemoveWorkerDayComponent);

    delDialog.afterClosed().subscribe((result) => {
      if (!result.result) return;
      this.loading.set(true);

      if (result.removeAll === true) {
        this.workerDayService
          .removeWorkersFromEvent(
            this.eventId,
            this.selection.selected
              .map((wd) => wd.worker)
              .filter((w) => typeof w === "number")
          )
          .subscribe((resp) => {
            if (resp.ok) {
              this.loadDays();
              this.selection.clear();
            }
            this.loading.set(false);
          });
      } else {
        this.workerDayService
          .removeWorkersDays(
            this.eventId,
            this.dayId,
            this.selection.selected
              .map((wd) => wd.id)
              .filter((w) => typeof w === "number")
          )
          .subscribe((resp) => {
            if (resp.ok) {
              this.loadDays();
              this.selection.clear();
            }
            this.loading.set(false);
          });
      }
    });
  }

  changeWorker() {
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
        if (newWorker?.id === this.selection.selected.at(0)?.worker) {
          this.workerDayService.showMsg(
            "Nie można zmienić na tego samego pracownika"
          );
          return;
        }
        const changeWorkerDialog = this.dialog.open(ChangeWorkerComponent, {
          data: { startDate: this.selection.selected.at(0)?.startTime },
        });

        changeWorkerDialog.afterClosed().subscribe((result) => {
          if (!result.state) return;

          this.loading.set(true);
          if (result.inRange && newWorker) {
            const payload: ChangeWorkerInDatesPayload = {
              newWorker: newWorker.id,
              newWorkerName: `${newWorker.firstName} ${newWorker.lastName}`,
              oldWorker: this.selection.selected.at(0)?.worker ?? -1,
              from: result.from,
              to: result.to,
            };
            this.workerDayService
              .changeWorkerInDates(this.eventId, payload)
              .subscribe((resp) => {
                if (resp.ok) {
                  this.loadDays();
                  this.selection.clear();
                } else this.workerDayService.showError(resp);
                this.loading.set(false);
              });
          } else if (newWorker) {
            const payload: ChangeWorkerPayload = {
              worker: newWorker.id ?? -1,
              workerName: `${newWorker.firstName} ${newWorker.lastName}`,
              workerDay: this.selection.selected.at(0)?.id ?? -1,
            };

            this.workerDayService
              .changeWorker(this.eventId, this.dayId, payload)
              .subscribe((resp) => {
                if (resp.ok) {
                  this.loadDays();
                  this.selection.clear();
                } else this.workerDayService.showError(resp);
                this.loading.set(false);
              });
          }
        });
      }
    });
  }

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
            this.loadDays();
            this.selection.clear();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
    });
  }

  changeInfo() {
    const changeInfoDialog = this.dialog.open(ChangeInfoComponent, {
      data: {
        info: this.eventDays().at(this.tabIdx)?.info,
      },
      maxWidth: "95vw",
    });

    changeInfoDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      this.service
        .changeInfo(this.eventId, this.dayId, result.info)
        .subscribe((resp) => {
          if (resp.ok) {
            this.loadDays();
          } else {
            this.service.showError(resp);
            this.loading.set(false);
          }
        });
    });
  }

  editRatesAndAddons() {
    this.router.navigateByUrl(
      `/admin/events/${this.eventId}/day/${this.dayId}/change?tab=${this.tabIdx}`,
      {
        state: {
          selected: this.selection.selected.slice(),
        },
      }
    );
  }

  @HostListener("document:keydown.Alt.a", ["$event"])
  handleAdd() {
    this.addDay();
  }
}
