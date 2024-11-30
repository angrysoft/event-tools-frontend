import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-remove-worker-day",
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./remove-worker-day.component.html",
  styleUrl: "./remove-worker-day.component.scss",
})
export class RemoveWorkerDayComponent {}
