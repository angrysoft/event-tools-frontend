import { Component, input, output } from "@angular/core";
import { CarMenuAction, CarScheduleDay } from "../../../models/car";
import { Day } from "../../../models/schedule";
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";

@Component({
  selector: "app-empty-car-day",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./empty-car-day.component.html",
  styleUrl: "./empty-car-day.component.scss",
})
export class EmptyCarDayComponent {
  data = input.required<{ data: Day; car: CarScheduleDay }>();
  actionTrigger = output<CarMenuAction>();

  triggerAction(action: string) {
    this.actionTrigger.emit({
      action: action,
      data: this.data(),
    });
  }
}
