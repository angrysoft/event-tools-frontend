import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ReportsService } from "../../services/reports.service";
import {
  DataTeamDay,
  DataWorkerDay,
  EventWorkerDay,
  FromDatesReport,
  Totals,
} from "../../models/reports";
import { ReportDataComponent } from "../../components/reports/report-data/report-data.component";
import { MonthReportWorkerInfoComponent } from "../../components/reports/month-report-worker-info/month-report-worker-info.component";
import { MatCardModule } from "@angular/material/card";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { MatButtonModule } from "@angular/material/button";
import { Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";

@Component({
  selector: "app-from-dates-report-view",
  imports: [
    ReportDataComponent,
    MonthReportWorkerInfoComponent,
    MatCardModule,
    ActionToolbarComponent,
    LoaderComponent,
    MatButtonModule,
  ],
  templateUrl: "./from-dates-report-view.component.html",
  styleUrl: "./from-dates-report-view.component.scss",
})
export class FromDatesReportViewComponent {
  router = inject(Router);
  loading = signal<boolean>(true);
  service = inject(ReportsService);
  reportData = signal<DataWorkerDay[]>([]);
  reportType = signal<"team" | "workers" | null>(null);
  totals = signal<Totals>({
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: "",
  });
  backTo = signal<string>("/admin/reports/from-dates");

  reportFrom: string = "";
  from: string = "";
  reportTo: string = "";
  to: string = "";
  name: string = "";
  reportMembers: string = "";

  tableColumns: { name: string; def: string }[] = [
    { name: "Numer", def: "eventNumber" },
    { name: "Nazwa", def: "eventName" },
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Pracownik", def: "workerName" },
    { name: "Godziny", def: "workHours" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateValue" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];

  constructor() {
    const reportConfig = this.router.getCurrentNavigation()?.extras.state;

    if (!reportConfig || !reportConfig["from"] || !reportConfig["to"]) {
      this.service.showMsg("Niepoprawne ustawienia raportu");
      return;
    }
    if (reportConfig["backTo"]) this.backTo.set(reportConfig["backTo"]);

    this.from = reportConfig["from"];
    this.to = reportConfig["to"];

    this.reportType.set(reportConfig["reportType"]);

    this.reportMembers = reportConfig["members"].join(",");
    let req: Observable<RestResponse<FromDatesReport>> | null = null;

    if (
      reportConfig["reportType"] == "team" &&
      reportConfig["members"].length === 1
    ) {
      req = this.service.getTeamRaportForBetween(
        reportConfig["from"],
        reportConfig["to"],
        this.reportMembers
      );
    } else if (
      reportConfig["reportType"] == "workers" &&
      this.reportMembers.length > 0
    ) {
      req = this.service.getWorkersRaportForBetween(
        reportConfig["from"],
        reportConfig["to"],
        this.reportMembers
      );
    }
    if (req)
      req.subscribe((resp) => {
        if (resp.ok) {
          this.name = resp.data.name;
          this.reportFrom = resp.data.fromDate;
          this.reportTo = resp.data.toDate;
          this.totals.set(resp.data.totals);
          this.setReport(resp.data.workerDays);
        } else this.service.showError(resp);
        this.loading.set(false);
      });
  }

  setReport(data: EventWorkerDay[]) {
    const workerDays: DataTeamDay[] = [];
    let currentEventName = "";

    for (const day of data) {
      if (currentEventName !== `${day.eventNumber}-${day.eventName}`) {
        if (currentEventName.length !== 0)
          workerDays.push({
            workerName: "",
            eventName: "",
            eventNumber: "",
            startTime: "",
            endTime: "",
            workHours: null,
            rateName: "",
            rateValue: "",
            addons: "",
            total: "",
            state: "",
          });
        currentEventName = `${day.eventNumber}-${day.eventName}`;
      }
      workerDays.push({
        workerName: day.workerDay.workerName ?? "",
        eventName: day.eventName,
        eventNumber: day.eventNumber,
        startTime: day.workerDay.startTime,
        endTime: day.workerDay.endTime,
        workHours: day.workerDay.workHours ?? 0,
        rateName: day.workerDay.rateName ?? "",
        rateValue: day.workerDay.rateValue ?? "",
        addons: day.workerDay.workerDayAddons
          .map((addon) => `${addon.name}:${addon.money}`)
          .join("\n"),
        total: day.workerDay.total ?? "",
        state: day.state ?? "",
      });
    }
    this.reportData.set(workerDays);
  }
}
