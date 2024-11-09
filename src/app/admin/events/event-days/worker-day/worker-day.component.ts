import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  untracked,
  ViewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatTable, MatTableModule } from "@angular/material/table";
import { EventDay, WorkerDay } from "../../../models/events";
import { WorkerDayDataSource } from "./worker-day-datasource";

@Component({
  selector: "app-worker-day",
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDivider,
    DatePipe,
  ],
  templateUrl: "./worker-day.component.html",
  styleUrl: "./worker-day.component.scss",
})
export class WorkerDayComponent implements AfterViewInit {
  dialog = inject(MatDialog);
  day = input.required<EventDay>();
  selection = input.required<SelectionModel<WorkerDay>>();

  @ViewChild(MatTable) table!: MatTable<WorkerDay>;
  dataSource!: WorkerDayDataSource;

  tableColumns: { name: string; def: string }[] = [
    { name: "select", def: "select" },
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateMoney" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];

  constructor() {
    this.dataSource = new WorkerDayDataSource();
    effect(() => {
      const days = this.day().workerDays ?? [];
      untracked(() => {
        this.dataSource.loadData(days);
      });
    });
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  isAllSelected() {
    return this.selection().selected.length === this.dataSource.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection().clear();
      return;
    }

    this.selection().select(...this.day().workerDays);
  }

  checkboxLabel(row?: WorkerDay): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection().isSelected(row) ? "deselect" : "select"} row ${
      row.id
    }`;
  }
}
