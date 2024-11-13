import { Component } from '@angular/core';
import { ScheduleComponent } from "../../components/schedule/schedule.component";

@Component({
  selector: 'app-work-schedule',
  standalone: true,
  imports: [ScheduleComponent],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent {
  
}
