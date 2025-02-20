import { DatePipe, KeyValuePipe } from "@angular/common";
import { Component, effect, inject, input, signal, viewChild, AfterViewInit } from "@angular/core";
import { MatTable, MatTableModule } from "@angular/material/table";
import { WorkerDaysService } from "../../../services/worker-days.service";
import { ReportDataSource } from "./report-datasource";

@Component({
  selector: "app-month-report-data",
  imports: [DatePipe, KeyValuePipe, MatTableModule],
  templateUrl: "./report-data.component.html",
  styleUrl: "./report-data.component.scss",
})
export class ReportDataComponent<T> implements AfterViewInit {
  workerDayService = inject(WorkerDaysService);
  readonly table = viewChild.required(MatTable);
  statuses = signal<{ [key: string]: string }>({});
  dataSource!: ReportDataSource<T>;
  data = input.required<T[]>();
  tableColumns = input.required<{ name: string; def: string }[]>();

  constructor() {
    this.workerDayService.getStatuses().subscribe((resp) => {
      if (resp.ok) this.statuses.set(resp.data);
    });
    this.dataSource = new ReportDataSource();

    effect(() => {
      this.dataSource.loadData(this.data());
    })
  }

  ngAfterViewInit(): void {
    this.table().dataSource = this.dataSource;
  }

  get columnNames() {
    return this.tableColumns().map((el) => el.def);
  }

  getStatus(state: string) {
    return this.statuses()[state];
  }
}
