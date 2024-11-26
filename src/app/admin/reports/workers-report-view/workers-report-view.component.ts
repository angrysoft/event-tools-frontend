import { Component, computed, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { ReportsService } from "../../../services/reports.service";
import { MonthReport } from "../../../models/reports";
import { MonthReportWorkerInfoComponent } from "../../../components/reports/month-report-worker-info/month-report-worker-info.component";
import { MonthReportDataComponent } from "../../../components/reports/month-report-data/month-report-data.component";

@Component({
  selector: "app-workers-report-view",
  imports: [LoaderComponent, ActionToolbarComponent, MatCardModule, MonthReportWorkerInfoComponent, MonthReportDataComponent],
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
    info: {
      name: "",
      date: ""
    },
    eventDays: [],
    totals: {
      basicPay: 0,
      totalHours: 0,
      totalAddons: "",
      totalRates: "",
      total: ""
    }
  });

  constructor() {
    const reportConfig = this.router.getCurrentNavigation()?.extras.state;
    if (!reportConfig || !reportConfig["month"] || !reportConfig["year"]) {
      this.service.showMsg("Niepoprawne ustawienia raportu");
      return;
    }

    this.reportType.set(reportConfig["reportType"]);
    this.month = reportConfig["month"];
    this.year = reportConfig["year"];

    if (reportConfig["reportType"] == "team")
      this.service.getMonthRaportForTeam(
        reportConfig["teamId"],
        this.month,
        this.year
      ).subscribe(resp=> {
        if (resp.ok) {
          this.report.set(resp.data);
        }
      })
    else if (reportConfig["reportType"] == "workers") {
      this.service.getMonthRaportForWorkers(
        reportConfig["worker"],
        this.month,
        this.year
      );
    }
  }
}
