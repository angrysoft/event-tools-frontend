import { Component, input, output } from "@angular/core";
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { CarScheduleDay, CarMenuAction } from "../../models/car";
import { Day } from "../../models/schedule";

@Component({
  selector: "app-empty-car-day",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./empty-car-day.component.html",
  styleUrl: "./empty-car-day.component.scss",
})
export class EmptyCarDayComponent {
  data = input.required<{ data: Day; car: CarScheduleDay }>();
  actionTrigger = output<CarMenuAction>();
  showMenu = input<boolean>(true);

  triggerAction(action: string) {
    this.actionTrigger.emit({
      action: action,
      data: this.data(),
    });
  }
}
