import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { Component, input, output } from "@angular/core";
import { MenuAction } from "../../../models/menu";
import { getTextColor } from "../../../utils/colors";

@Component({
  selector: "app-event-day",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./event-day.component.html",
  styleUrl: "./event-day.component.scss",
})
export class EventDayComponent {
  showMenu = input<boolean>(false);
  actionTrigger = output<MenuAction>();
  data = input<any>();

  triggerAction(action: string) {
    console.log("trigger", action);
    this.actionTrigger.emit({
      action: action,
      data: this.data(),
    });
  }

  getTextColor(color: string) {
    return getTextColor(color);
  }
}