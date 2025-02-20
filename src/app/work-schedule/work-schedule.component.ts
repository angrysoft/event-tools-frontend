import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ScheduleComponent } from "../components/schedule/schedule.component";
import { ScheduleAction, WorkerDaySchedule } from "../models/schedule";

@Component({
    selector: "app-work-schedule",
    imports: [ScheduleComponent],
    templateUrl: "./work-schedule.component.html",
    styleUrl: "./work-schedule.component.scss"
})
export class WorkScheduleComponent {
  private readonly router = inject(Router);

  onAction(action: ScheduleAction) {
    if (action.action == "event") {
      const data = action.data as WorkerDaySchedule;
      this.router.navigateByUrl(
        `/admin/events/${data.eventId}/day?name=${data.eventName}&date=${data.startDate}`,
      );
    } else if (action.action == "worker") {
      this.router.navigateByUrl(
        `/admin/workers/${(action.data as { workerId: number }).workerId}`,
      );
    }
  }
}
