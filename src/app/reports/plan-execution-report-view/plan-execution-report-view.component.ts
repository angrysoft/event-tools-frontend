import { DatePipe, KeyValuePipe } from "@angular/common";
import { Component, inject, signal, viewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatTable } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { WorkerEventDayComponent } from "../../components/events/worker-event-day/worker-event-day.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { EventItemDto } from "../../models/events";
import { EventPlanExecutionDay, Totals } from "../../models/reports";
import { ReportsService } from "../../services/reports.service";
import { WorkerDaysService } from "../../services/worker-days.service";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-plan-execution-report-view",
  imports: [
    ActionToolbarComponent,
    MatCardModule,
    MatButtonModule,
    KeyValuePipe,
    DatePipe,
    LoaderComponent,
    MatDivider,
    WorkerEventDayComponent,
  ],
  templateUrl: "./plan-execution-report-view.component.html",
  styleUrl: "./plan-execution-report-view.component.scss",
})
export class PlanExecutionReportViewComponent {
  reportService = inject(ReportsService);
  workerDayService = inject(WorkerDaysService);
  route = inject(ActivatedRoute);
  router = inject(Router);

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
    location:null,
    locationUrl: null,
  });

  totalsPlan = signal<Totals>({
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: "",
  });

  totalsExecution = signal<Totals>({
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: "",
  });

  days = signal<EventPlanExecutionDay[]>([]);
  backTo = signal<string>("/admin/reports/plan-execution");

  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  readonly table = viewChild.required(MatTable);

  tableColumns: { name: string; def: string }[] = [
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
      .getPlanExecutionReport(this.eventId)
      .subscribe((resp) => {
        if (resp.ok) {
          this.eventInfo.set(resp.data.info);
          this.days.set(resp.data.days);
          this.totalsPlan.set(resp.data.totalPlan);
          this.totalsExecution.set(resp.data.totalExecution);
        }
        this.loading.set(false);
      });
  }
}
