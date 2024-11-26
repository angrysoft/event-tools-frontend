import { Component, computed, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { ReportsService } from "../../../services/reports.service";
import {
  DataWorkerDay,
  EventWorkerDay,
  MonthReport,
  MonthTotal,
} from "../../../models/reports";
import { MonthReportWorkerInfoComponent } from "../../../components/reports/month-report-worker-info/month-report-worker-info.component";
import { MonthReportDataComponent } from "../../../components/reports/month-report-data/month-report-data.component";

@Component({
  selector: "app-workers-report-view",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    MatCardModule,
    MonthReportWorkerInfoComponent,
    MonthReportDataComponent,
  ],
  templateUrl: "./workers-report-view.component.html",
  styleUrl: "./workers-report-view.component.scss",
})
export class WorkersReportViewComponent {
  router = inject(Router);
  loading = signal<boolean>(true);
  service = inject(ReportsService);
  reportType = signal<"team" | "workers" | null>(null);
  month: string = "";
  year: string = "";
  canGetReport = computed(() => {
    return (
      !this.reportType() &&
      !this.month &&
      this.month.length > 0 &&
      !this.year &&
      this.year.length > 0
    );
  });
  report = signal<MonthReport>({
    totals: {
      basicPay: 0,
      totalHours: 0,
      totalAddons: "",
      totalRates: "",
      total: "",
    },
    name: "",
    reportDate: "",
    workerDays: [],
  });
  totals = signal<MonthTotal>({
    basicPay: 0,
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: "",
  });
  reportData = signal<DataWorkerDay[]>([]);

  tableColumns: { name: string; def: string }[] = [
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
  name: string = "";
  reportDate: string = "";

  constructor() {
    const reportConfig = this.router.getCurrentNavigation()?.extras.state;
    if (!reportConfig || !reportConfig["month"] || !reportConfig["year"]) {
      this.service.showMsg("Niepoprawne ustawienia raportu");
      return;
    }
    console.log(reportConfig);
    this.reportType.set(reportConfig["reportType"]);
    this.month = reportConfig["month"];
    this.year = reportConfig["year"];

    if (reportConfig["reportType"] == "team")
      this.service
        .getMonthRaportForTeam(reportConfig["teamId"], this.month, this.year)
        .subscribe((resp) => {
          if (resp.ok) {
            console.log(resp.data);
            this.report.set(resp.data);
          } else this.service.showError(resp);
          this.loading.set(false);
        });
    else if (reportConfig["reportType"] == "workers") {
      this.service
        .getMonthRaportForWorkers(
          reportConfig["worker"],
          Number(this.month) + 1,
          this.year
        )
        .subscribe((resp) => {
          if (resp.ok) {
            // this.report.set(resp.data);
            this.name = resp.data.name;
            this.reportDate = resp.data.reportDate;
            this.totals.set(resp.data.totals);
            this.setReport(resp.data.workerDays);
          } else this.service.showError(resp);
          this.loading.set(false);
        });
    }
  }

  setReport(data: EventWorkerDay[]) {
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
        state: day.workerDay.state ?? "",
      });
    }
    this.reportData.set(workerDays);
  }
}
