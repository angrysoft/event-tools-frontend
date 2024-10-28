import { SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnInit,
  untracked,
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
import { MatDialog } from "@angular/material/dialog";
import { AddWorkersComponent } from "./add-workers/add-workers.component";
import { RouterLink } from "@angular/router";

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
    RouterLink,
  ],
  templateUrl: "./worker-day.component.html",
  styleUrl: "./worker-day.component.scss",
})
export class WorkerDayComponent implements AfterViewInit {
  dialog = inject(MatDialog);
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
    effect(() => {
      const days = this.day().workerDays ?? [];
      untracked(() => {
        if (days.length > 0) this.dataSource.loadData(days);
      });
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  get isMultipleSelected() {
    // always return true ?!?!
    //this.selection.isMultipleSelection()
    return this.selection.selected.length !== 1;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.day().workerDays);
  }

  checkboxLabel(row?: WorkerDay): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id
    }`;
  }

  addWorkers() {
    const addWorkersDialog = this.dialog.open(AddWorkersComponent, {
      data: { ...this.day() },
      disableClose: true,
      maxWidth: "90dvw",
    });

    addWorkersDialog.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  editWorker() {}

  removeWorkers() {}

  changeWorker() {}
}
