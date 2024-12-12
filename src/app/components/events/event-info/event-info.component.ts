import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { EventItemDto } from '../../../models/events';
import { SafeHtmlPipe } from "../../../pipes/safe-html.pipe";

@Component({
  selector: 'app-event-info',
  imports: [MatCardModule, MatTabsModule, SafeHtmlPipe],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss'
})
export class EventInfoComponent {
  eventData = input.required<EventItemDto>();
  showDays = input<boolean>(false);
  tabIndex = input<number>(1);
}
