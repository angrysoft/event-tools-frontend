import { Component, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: "app-work-schedule",
  imports: [ScheduleComponent],
  templateUrl: "./work-schedule.component.html",
  styleUrl: "./work-schedule.component.scss",
})
export class WorkScheduleComponent {
  dialog = inject(MatDialog);

  onAction(action: any) {
    if (action.action === "worker") {
      this.dialog.open(ContactComponent, {
        data: { worker: action.data.workerId },
      });
    }
  }
}
