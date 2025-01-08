import { Component, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { CarDoc } from "../../../../models/car";

@Component({
  selector: "app-car-docs",
  imports: [MatCardModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: "./car-docs.component.html",
  styleUrl: "./car-docs.component.scss",
})
export class CarDocsComponent {
  docs = input.required<CarDoc[]>();
  carId = input.required<number | null>();
  remove = output<number | null>();

  removeDoc(id: number | null) {
    this.remove.emit(id);
  }
}
