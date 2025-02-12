import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { WorkerDay } from "../../../models/events";

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
  workerDays = input.required<WorkerDay[]>();
  tableColumns = input.required<{ name: string; def: string }[]>();
  colorClass = input<string>("");
  hideAmount = input<boolean>(false);

  get columnNames() {
    return this.tableColumns().map((el) => el.def);
  }

  get daysDataSource() {
   
    const days = this.workerDays().map((d) => {
      d.addons = d.workerDayAddons
        .map((addon) => {
          if (addon.money && !this.hideAmount()) return `${addon.name}:${addon.money}`;
          else return addon.name;
        })
        .join("\n");
      return d;
    });
    return days;
  }
}
