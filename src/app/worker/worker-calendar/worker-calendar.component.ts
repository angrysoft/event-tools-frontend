import { Component } from '@angular/core';
import { CalendarViewComponent } from "../../components/calendar-view/calendar-view.component";

@Component({
  selector: 'app-worker-calendar',
  imports: [CalendarViewComponent],
  templateUrl: './worker-calendar.component.html',
  styleUrl: './worker-calendar.component.scss'
})
export class WorkerCalendarComponent {

}
