import { Component, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { ContactComponent } from "../contact/contact.component";
import { ScheduleAction, ScheduleWorkerId } from "../../models/schedule";

@Component({
  selector: "app-work-schedule",
  imports: [ScheduleComponent],
  templateUrl: "./work-schedule.component.html",
  styleUrl: "./work-schedule.component.scss",
})
export class WorkScheduleComponent {
  dialog = inject(MatDialog);

  onAction(action: ScheduleAction) {
    if (action.action === "worker") {
      const data = action.data as ScheduleWorkerId;
      this.dialog.open(ContactComponent, {
        data: { worker: data.workerId },
      });
    }
  }
}
