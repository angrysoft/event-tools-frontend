import { DatePipe, KeyValuePipe } from "@angular/common";
import { Component, inject, input, signal, viewChild } from "@angular/core";
import { MatTable, MatTableModule } from "@angular/material/table";
import { WorkerDaysService } from "../../../admin/services/worker-days.service";
import { MonthReportDataSource } from "./month-report-datasource";

@Component({
  selector: "app-month-report-data",
  imports: [DatePipe, KeyValuePipe, MatTableModule],
  templateUrl: "./month-report-data.component.html",
  styleUrl: "./month-report-data.component.scss",
})
export class MonthReportDataComponent<T> {
  workerDayService = inject(WorkerDaysService);
  readonly table = viewChild.required(MatTable);
  statuses = signal<{ [key: string]: string }>({});
  dataSource!: MonthReportDataSource<T>;
  data = input.required<T[]>();
  tableColumns = input.required<{ name: string; def: string }[]>();

  constructor() {
    this.workerDayService.getStatuses().subscribe((resp) => {
      if (resp.ok) this.statuses.set(resp.data);
    });
    this.dataSource = new MonthReportDataSource();
  }

  ngAfterViewInit(): void {
    this.table().dataSource = this.dataSource;
    this.dataSource.loadData(this.data());
  }

  get columnNames() {
    return this.tableColumns().map((el) => el.def);
  }

  getStatus(state: string) {
    return this.statuses()[state];
  }
}
