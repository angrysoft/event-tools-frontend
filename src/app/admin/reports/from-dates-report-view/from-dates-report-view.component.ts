import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ReportsService } from "../../../services/reports.service";
import {
  DataTeamDay,
  DataWorkerDay,
  EventWorkerDay,
  Totals,
} from "../../../models/reports";
import { ReportDataComponent } from "../../../components/reports/report-data/month-report-data.component";
import { MonthReportWorkerInfoComponent } from "../../../components/reports/month-report-worker-info/month-report-worker-info.component";
import { MatCardModule } from "@angular/material/card";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { MatButtonModule } from "@angular/material/button";

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
  reportFrom: string = "";
  reportTo: string = "";
  name: string = "";
  reportMembers: string = "";

  tableColumnsWorker: { name: string; def: string }[] = [
    { name: "Numer", def: "eventNumber" },
    { name: "Nazwa", def: "eventName" },
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateValue" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];

  tableColumnsTeam: { name: string; def: string }[] = [
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

  tableColumns: { name: string; def: string }[] = [];

  constructor() {
    const reportConfig = this.router.getCurrentNavigation()?.extras.state;
    if (!reportConfig || !reportConfig["from"] || !reportConfig["to"]) {
      this.service.showMsg("Niepoprawne ustawienia raportu");
      return;
    }

    if (reportConfig["reportType"] === "worker")
      this.tableColumns = this.tableColumnsWorker;
    else if (reportConfig["reportType"] == "team")
      this.tableColumns = this.tableColumnsTeam;

    this.reportType.set(reportConfig["reportType"]);

    this.reportMembers = reportConfig["members"].join(",");

    if (
      reportConfig["reportType"] == "team" &&
      reportConfig["members"].length === 1
    ) {
      this.service
        .getTeamRaportForBetween(
          reportConfig["from"],
          reportConfig["to"],
          this.reportMembers
        )
        .subscribe((resp) => {
          if (resp.ok) {
            this.name = resp.data.name;
            this.reportFrom = resp.data.fromDate;
            this.reportTo = resp.data.toDate;
            this.totals.set(resp.data.totals);
            this.setReportTeam(resp.data.workerDays);
          } else this.service.showError(resp);
          this.loading.set(false);
        });
    } else if (
      reportConfig["reportType"] == "worker" &&
      this.reportMembers.length > 0
    ) {
      this.service
        .getWorkersRaportForBetween(
          reportConfig["from"],
          reportConfig["to"],
          this.reportMembers
        )
        .subscribe((resp) => {
          if (resp.ok) {
            this.name = resp.data.name;

            this.totals.set(resp.data.totals);
            this.setReportWorker(resp.data.workerDays);
          } else this.service.showError(resp);
          this.loading.set(false);
        });
    }
  }

  setReportWorker(data: EventWorkerDay[]) {
    const workerDays: DataWorkerDay[] = [];
    for (const day of data) {
      workerDays.push({
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

  setReportTeam(data: EventWorkerDay[]) {
    const workerDays: DataTeamDay[] = [];
    for (const day of data) {
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
