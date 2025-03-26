import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDivider } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { EventDay, WorkerDay } from "../../../models/events";

@Component({
  selector: "app-worker-day",
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
export class WorkerDayComponent {
  day = input.required<EventDay>();
  coordinatorId = input<number | null>(null);
  selection = input.required<SelectionModel<WorkerDay>>();
  tableColumns = input.required<{ name: string; def: string }[]>();
  admin = input<boolean>(false);
  length = 0;

  get columnNames() {
    return this.tableColumns().map((el) => el.def);
  }

  get daysDataSource() {
    const workerDays = this.day().workerDays ?? [];
    const days = workerDays.map((d) => {
      d.addons = d.workerDayAddons
        .map((addon) => {
          if (addon.money) return `${addon.name}:${addon.money}`;
          else return addon.name;
        })
        .join("\n");
      return d;
    });
    this.length = workerDays.length;
    return days;
  }

  isAllSelected() {
    return this.selection().selected.length === this.length;
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

  getClass(row:WorkerDay) {
    if (row["editedByChief"] && this.admin())
      return "CHIEF"
    return "";
  }
}
