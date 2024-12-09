import { Component, input } from "@angular/core";
import { Car } from "../../../models/car";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-worker-car",
  imports: [MatCardModule, MatListModule],
  templateUrl: "./worker-car.component.html",
  styleUrl: "./worker-car.component.scss",
})
export class WorkerCarComponent {
  cars = input.required<Car[]>();
}
