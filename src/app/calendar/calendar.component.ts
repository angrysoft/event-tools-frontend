import { Component } from "@angular/core";
import { CalendarViewComponent } from "../components/calendar-view/calendar-view.component";

@Component({
  selector: "app-calendar",
  imports: [CalendarViewComponent],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent {}
