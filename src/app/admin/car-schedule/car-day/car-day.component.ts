import { Component, input, output } from "@angular/core";
import { getTextColor } from "../../../utils/colors";
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { CarDay, CarMenuAction } from "../../../models/car";

@Component({
  selector: "app-car-day",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./car-day.component.html",
  styleUrl: "./car-day.component.scss",
})
export class CarDayComponent {
  data = input.required<CarDay>();
  actionTrigger = output<CarMenuAction>();

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
