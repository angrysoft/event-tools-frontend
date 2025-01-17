import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { MonthReportWorkerInfoComponent } from "../../components/reports/month-report-worker-info/month-report-worker-info.component";
import { ReportDataComponent } from "../../components/reports/report-data/report-data.component";
import {
  DataTeamDay,
  DataWorkerDay,
  EventWorkerDay,
  MonthTotal,
} from "../../models/reports";
import { ReportsService } from "../../services/reports.service";

@Component({
  selector: "app-workers-report-view",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    MatCardModule,
    MonthReportWorkerInfoComponent,
    ReportDataComponent,
    MatButtonModule,
  ],
  templateUrl: "./workers-report-view.component.html",
  styleUrl: "./workers-report-view.component.scss",
})
export class WorkersReportViewComponent {
  router = inject(Router);
  loading = signal<boolean>(true);
  service = inject(ReportsService);
  reportType = signal<"team" | "workers" | null>(null);
  reportMemberId: number = 0;
  month: number = 0;
  year: number = 2024;
  backTo = "/admin/reports/workers";

  totals = signal<MonthTotal>({
    basicPay: 0,
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: "",
  });
  reportData = signal<DataWorkerDay[]>([]);

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

  name: string = "";
  reportDate: string = "";

  constructor() {
    const reportConfig = this.router.getCurrentNavigation()?.extras.state;
    console.log(reportConfig);
    if (!reportConfig || reportConfig["month"] === null || reportConfig["year"] === null) {
      this.service.showMsg("Niepoprawne ustawienia raportu");
      return;
    }

    if (reportConfig["backTo"]) this.backTo = reportConfig["backTo"];

    if (reportConfig["reportType"] === "worker")
      this.tableColumns = this.tableColumnsWorker;
    else if (reportConfig["reportType"] == "team")
      this.tableColumns = this.tableColumnsTeam;

    this.reportType.set(reportConfig["reportType"]);
    this.month = Number(reportConfig["month"]) + 1;
    this.year = reportConfig["year"];

    if (reportConfig["reportType"] == "team") {
      this.reportMemberId = reportConfig["teamId"];
      this.service
        .getMonthRaportForTeam(reportConfig["teamId"], this.month, this.year)
        .subscribe((resp) => {
          if (resp.ok) {
            this.name = resp.data.name;
            this.reportDate = resp.data.reportDate;
            this.totals.set(resp.data.totals);
            this.setReportTeam(resp.data.workerDays);
          } else this.service.showError(resp);
          this.loading.set(false);
        });
    } else if (reportConfig["reportType"] == "worker") {
      this.reportMemberId = reportConfig["worker"];
      this.service
        .getMonthRaportForWorkers(reportConfig["worker"], this.month, this.year)
        .subscribe((resp) => {
          if (resp.ok) {
            this.name = resp.data.name;
            this.reportDate = resp.data.reportDate;
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
