import { Component, inject } from "@angular/core";
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { Router } from "@angular/router";
import { WorkerDaySchedule } from "../../models/schedule";

@Component({
  selector: "app-work-schedule",
  standalone: true,
  imports: [ScheduleComponent],
  templateUrl: "./work-schedule.component.html",
  styleUrl: "./work-schedule.component.scss",
})
export class WorkScheduleComponent {
  private readonly router = inject(Router);

  onAction(data: WorkerDaySchedule) {
    this.router.navigateByUrl(
      `/admin/events/${data.eventId}/day?name=${data.eventName}&tab=${data.startDate}`, 
    );
  }
}
