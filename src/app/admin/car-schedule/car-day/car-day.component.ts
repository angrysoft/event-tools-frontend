import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { Component, input, output } from "@angular/core";
import { CarDay, CarMenuAction } from "../../../models/car";
import { getTextColor } from "../../../utils/colors";

@Component({
  selector: "app-car-day",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./car-day.component.html",
  styleUrl: "./car-day.component.scss",
})
export class CarDayComponent {
  data = input.required<CarDay>();
  actionTrigger = output<CarMenuAction>();
  carName = input<string>();
  isMultipleSelected = input<boolean>(false);
  selected = input<boolean>(false);

  triggerAction(action: string, ev: MouseEvent | null = null) {
    if (action === "showDay" && ev) {
      if (ev.ctrlKey) {
        this.actionTrigger.emit({
          action: "selectDay",
          data: this.data(),
        });
        return;
      }
    }
    this.actionTrigger.emit({
      action: action,
      data: { ...this.data(), carName: this.carName() },
    });
  }

  getTextColor(color: string) {
    return getTextColor(color);
  }
}
