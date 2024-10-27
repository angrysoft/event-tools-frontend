import { SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  Component,
  input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTable, MatTableModule } from "@angular/material/table";
import { EventDay, WorkerDay } from "../../../models/events";
import { WorkerDayDataSource } from "./worker-day-datasource";
import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-worker-day",
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDivider,
    MatIcon,
    DatePipe,
  ],
  templateUrl: "./worker-day.component.html",
  styleUrl: "./worker-day.component.scss",
})
export class WorkerDayComponent implements AfterViewInit, OnInit {
  day = input.required<EventDay>();

  selection = new SelectionModel<WorkerDay>(true, []);
  @ViewChild(MatTable) table!: MatTable<WorkerDay>;
  dataSource!: WorkerDayDataSource;

  tableColumns: { name: string; def: string }[] = [
    { name: "select", def: "select" },
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "calculatedRate" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];

  constructor() {
    this.dataSource = new WorkerDayDataSource();
  }

  ngOnInit(): void {
    this.dataSource.loadData(this.day().workerDays);
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  get isNothingSelected() {
    return this.selection.isEmpty();
  }

  get isMultipleSelected() {
    // always return true ?!?!
    //this.selection.isMultipleSelection()
    return this.selection.selected.length !== 1;
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

    this.selection.select(...this.day().workerDays);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: WorkerDay): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id
    }`;
  }

  changeSelection() {
    console.log(this.selection.selected, this.selection.selected.length !== 1);
  }
}
