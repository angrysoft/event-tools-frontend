import { Component, inject } from "@angular/core";
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  ScheduleAction,
  ScheduleWorkerId,
  WorkerDaySchedule,
} from "../../models/schedule";
import { ContactComponent } from "../../worker/contact/contact.component";

@Component({
  selector: "app-warehouseman-schedule",
  imports: [ScheduleComponent],
  templateUrl: "./warehouseman-schedule.component.html",
  styleUrl: "./warehouseman-schedule.component.scss",
})
export class WarehousemanScheduleComponent {
  dialog = inject(MatDialog);
  router = inject(Router);

  onAction(action: ScheduleAction) {
    if (action.action === "worker") {
      const data = action.data as ScheduleWorkerId;
      this.dialog.open(ContactComponent, {
        data: { worker: data.workerId },
      });
    } else if (action.action === "event") {
      const data = action.data as WorkerDaySchedule;
      this.router.navigateByUrl(`/warehouseman/event/${data.eventId}`, {
        state: { backTo: "/warehouseman/work-schedule" },
      });
    }
  }
}
