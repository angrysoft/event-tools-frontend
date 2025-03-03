import { CdkMenuModule } from "@angular/cdk/menu";
import { Component, inject, input, output } from "@angular/core";
import { Router } from "@angular/router";
import { CalendarEvent } from "../../../models/calendar";
import { MenuAction } from "../../../models/menu";
import { getTextColor } from "../../../utils/colors";

@Component({
  selector: "app-calendar-item",
  imports: [CdkMenuModule],
  templateUrl: "./calendar-item.component.html",
  styleUrl: "./calendar-item.component.scss",
})
export class CalendarItemComponent {
  private readonly router = inject(Router);
  data = input.required<CalendarEvent>();
  actionTrigger = output<MenuAction>();

  getTextColor(color: string) {
    return getTextColor(color);
  }

  goToAction() {
    this.actionTrigger.emit({
      action: "goTo",
      data: this.data().event
    })
  }

  removeAction() {
    this.actionTrigger.emit({
      action: "remove",
      data: this.data().id,
    });
  }
}
