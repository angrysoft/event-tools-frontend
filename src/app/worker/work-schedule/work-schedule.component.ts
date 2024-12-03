import { Component, inject } from "@angular/core";
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { ScheduleAction } from "../../models/schedule";
import { Router } from "@angular/router";

@Component({
  selector: "app-work-schedule",
  imports: [ScheduleComponent],
  templateUrl: "./work-schedule.component.html",
  styleUrl: "./work-schedule.component.scss",
})
export class WorkScheduleComponent {
  private readonly router = inject(Router);
  
  onAction(action: ScheduleAction) {
    console.log(action);
  }
}
