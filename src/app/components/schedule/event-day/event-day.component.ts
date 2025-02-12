import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { Component, input, output } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MenuAction } from "../../../models/menu";
import { WorkerDaySchedule } from "../../../models/schedule";
import { getTextColor } from "../../../utils/colors";

@Component({
  selector: "app-event-day",
  imports: [
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: "./event-day.component.html",
  styleUrl: "./event-day.component.scss",
})
export class EventDayComponent {
  showMenu = input<boolean>(false);
  actionTrigger = output<MenuAction>();
  data = input.required<WorkerDaySchedule>();

  triggerAction(action: string) {
    this.actionTrigger.emit({
      action: action,
      data: this.data(),
    });
  }

  getTextColor(color: string) {
    return getTextColor(color);
  }
}
