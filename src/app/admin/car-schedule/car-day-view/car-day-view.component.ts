import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-car-day-view",
  imports: [MatDialogModule, DatePipe, MatButtonModule],
  templateUrl: "./car-day-view.component.html",
  styleUrl: "./car-day-view.component.scss",
})
export class CarDayViewComponent {
  data = inject(MAT_DIALOG_DATA);
}
