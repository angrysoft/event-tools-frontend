import { CdkMenuModule } from "@angular/cdk/menu";
import { Component, inject, input, output } from "@angular/core";
import { Router } from "@angular/router";
import { CalendarEvent } from "../../../models/calendar";
import { getTextColor } from "../../../utils/colors";
import { MenuAction } from "../../../models/menu";

@Component({
  selector: "app-calendar-item",
  imports: [CdkMenuModule],
  templateUrl: "./calendar-item.component.html",
  styleUrl: "./calendar-item.component.scss",
})
export class CalendarItemComponent {
  private readonly router = inject(Router);
  data = input.required<CalendarEvent>();
  eventUrl = input<string>("/admin/events");
  actionTrigger = output<MenuAction>();

  getTextColor(color: string) {
    return getTextColor(color);
  }

  goToEvent(event: number) {
    this.router.navigateByUrl(`${this.eventUrl()}/${event}`);
  }

  triggerAction(action: string) {
    this.actionTrigger.emit({
      action: action,
      data: this.data().id,
    });
  }
}
