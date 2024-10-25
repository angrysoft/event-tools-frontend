import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, input, ViewChild } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableModule } from "@angular/material/table";
import { EventDay, WorkerDay } from "../../../models/events";
import { WorkerDayDataSource } from "./worker-day-datasource";

@Component({
  selector: "app-worker-day",
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
  templateUrl: "./worker-day.component.html",
  styleUrl: "./worker-day.component.scss",
})
export class WorkerDayComponent implements AfterViewInit {
  day = input.required<EventDay>();

  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<WorkerDay>;
  dataSource!: WorkerDayDataSource<WorkerDay>;
  
  tableColumns: { name: string; def: string }[] = [
    { name: "Pracownik", def: "workerNAme" },
  ];

  constructor() {
    this.dataSource = new WorkerDayDataSource();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData(this.day().workerDays);
    console.log(this.day().workerDays);
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    // this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
