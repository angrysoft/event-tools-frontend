import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { EventDay } from "../../../models/events";

@Component({
  selector: "app-worker-event-day",
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: "./worker-event-day.component.html",
  styleUrl: "./worker-event-day.component.scss",
})
export class WorkerEventDayComponent {
  day = input.required<EventDay>();
  tableColumns = input.required<{ name: string; def: string }[]>();
  colorClass = input<string>("");

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
    return days;
  }
}
