import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe, KeyValuePipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatListOption } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { WorkerEventDayComponent } from "../../components/events/worker-event-day/worker-event-day.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { WorkerFilterComponent } from "../../components/reports/worker-filter/worker-filter.component";
import { EventDay, EventItemDto } from "../../models/events";
import { Totals } from "../../models/reports";
import { ReportsService } from "../../services/reports.service";
import { WorkerDaysService } from "../../services/worker-days.service";

@Component({
  selector: "app-event-report-view",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    DatePipe,
    KeyValuePipe,
    MatSlideToggleModule,
    MatMenuModule,
    WorkerEventDayComponent,
    MatDividerModule,
  ],
  templateUrl: "./event-report-view.component.html",
  styleUrl: "./event-report-view.component.scss",
})
export class EventReportViewComponent {
  reportService = inject(ReportsService);
  workerDayService = inject(WorkerDaysService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);
  days = signal<EventDay[]>([]);
  loading = signal<boolean>(true);
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
    edited: "",
  });
  totals = signal<Totals>({
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: "",
  });
  backTo = signal<string>("/admin/reports/event");

  hideAmount = signal<boolean>(false);
  workerSelection = new SelectionModel<number>();
  workerList = signal<WorkerSelection[]>([]);
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);

  tableColumnsFull: { name: string; def: string }[] = [
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateValue" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];

  tableColumnsHided: { name: string; def: string }[] = [
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Dodatki", def: "addons" },
  ];

  tableColumns: { name: string; def: string }[] = this.tableColumnsFull;

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      if (state["backTo"]) {
        this.backTo.set(state["backTo"]);
      }
    }

    this.workerDayService.getStatuses().subscribe((resp) => {
      if (resp.ok) this.statuses.set(resp.data);
    });
    if (this.eventId) {
      this.loadDays();
    }
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  getStatus(state: string) {
    return this.statuses()[state];
  }

  private loadDays() {
    this.reportService
      .getEventRaportForWorkers(this.eventId, this.workerSelection.selected)
      .subscribe((resp) => {
        if (resp.ok) {
          this.eventInfo.set(resp.data.info);
          this.totals.set(resp.data.totals);
          const workers: { [key: number]: { id: number; workerName: string } } =
            {};
          for (const eventDay of resp.data.eventDays) {
            eventDay.workerDays.forEach((wd) => {
              wd.state = eventDay.state;
              if (
                wd.worker &&
                wd.workerName &&
                this.workerSelection.isEmpty()
              ) {
                workers[wd.worker] = {
                  id: wd.worker,
                  workerName: wd.workerName,
                };
              }
              return wd;
            });
          }
          if (this.workerSelection.isEmpty())
            this.workerList.set(Object.values(workers));

          this.days.set(resp.data.eventDays);
        }
        this.loading.set(false);
      });
  }

  onHide(ev: MatSlideToggleChange) {
    if (ev.checked) {
      this.tableColumns = this.tableColumnsHided;
    } else {
      this.tableColumns = this.tableColumnsFull;
    }
    this.hideAmount.set(ev.checked);
  }

  filterWorkers() {
    const filterWorkersDialog = this.dialog.open(WorkerFilterComponent, {
      data: { workers: this.workerList() },
    });

    filterWorkersDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.workerSelection.select(result.map((v: MatListOption) => v.value));
        this.loadDays();
      }
    });
  }
}

interface WorkerSelection {
  id: number;
  workerName: string;
}
