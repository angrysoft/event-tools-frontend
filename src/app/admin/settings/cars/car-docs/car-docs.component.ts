import { Component, input } from "@angular/core";
import { CarDoc } from "../../../../models/car";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-car-docs",
  imports: [MatCardModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: "./car-docs.component.html",
  styleUrl: "./car-docs.component.scss",
})
export class CarDocsComponent {
  docs = input.required<CarDoc[]>();
  carId = input.required<number | null>();

  removeFile(id: number | null) {
    console.log(id);
  }
}
