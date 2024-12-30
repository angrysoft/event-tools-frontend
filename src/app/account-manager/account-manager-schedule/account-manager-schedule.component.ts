import { Component, inject } from "@angular/core";
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { MatDialog } from "@angular/material/dialog";
import {
  ScheduleAction,
  ScheduleWorkerId,
  WorkerDaySchedule,
} from "../../models/schedule";
import { ContactComponent } from "../../worker/contact/contact.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-account-manager-schedule",
  imports: [ScheduleComponent],
  templateUrl: "./account-manager-schedule.component.html",
  styleUrl: "./account-manager-schedule.component.scss",
})
export class AccountManagerScheduleComponent {
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
      this.router.navigateByUrl(`/account-manager/event/${data.eventId}`, {
        state: { backTo: "/account-manager/work-schedule" },
      });
    }
  }
}
