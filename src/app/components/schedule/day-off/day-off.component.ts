import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { Component, input, output } from "@angular/core";
import { MenuAction } from "../../../models/menu";

@Component({
  selector: "app-day-off",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./day-off.component.html",
  styleUrl: "./day-off.component.scss",
})
export class DayOffComponent {
  showMenu = input<boolean>(false);
  accepted = input.required<boolean>();
  actionTrigger = output<MenuAction>();
  data = input<any>();

  triggerAction(action: string) {
    this.actionTrigger.emit({
      action: action,
      data: this.data(),
    });
  }
}
