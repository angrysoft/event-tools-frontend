import { Component, inject, signal } from "@angular/core";
import { ReportDataComponent } from "../../components/reports/report-data/report-data.component";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import {
  MonthTotal,
  DataWorkerDay,
  EventWorkerDay,
} from "../../models/reports";
import { ReportsService } from "../../services/reports.service";
import { MonthReportWorkerInfoComponent } from "../../components/reports/month-report-worker-info/month-report-worker-info.component";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { DateChangerComponent } from "../../components/date-changer/date-changer.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-worker-report",
  imports: [
    ReportDataComponent,
    MatCardModule,
    MonthReportWorkerInfoComponent,
    ActionToolbarComponent,
    LoaderComponent,
    DateChangerComponent,
    MatButtonModule,
  ],
  templateUrl: "./worker-report.component.html",
  styleUrl: "./worker-report.component.scss",
})
export class WorkerReportComponent {
  router = inject(Router);
  loading = signal<boolean>(true);
  service = inject(ReportsService);
  canDownloadReport = signal<boolean>(true);
  reportMemberId: number = 0;
  month: number = 0;
  year: number = 2024;

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

  constructor() {}

  loadData() {
    this.service
      .getOwnMonthRaportForWorker(this.month, this.year)
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

  setReportWorker(data: EventWorkerDay[]) {
    const workerDays: DataWorkerDay[] = [];
    this.canDownloadReport.set(true);
    for (const day of data) {
      console.log(day.state)
      if (day.state !== "APPROVED") this.canDownloadReport.set(false);
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

  dateChange(date: string) {
    const cDate = new Date(date);
    this.month = cDate.getMonth() + 1;
    this.year = cDate.getFullYear();
    this.loadData();
  }
}
