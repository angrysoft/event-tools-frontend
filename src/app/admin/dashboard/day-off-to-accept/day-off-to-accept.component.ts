import { Component, inject, signal } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { DashboardService } from "../../../services/dashboard.service";

@Component({
  selector: "app-day-off-to-accept",
  imports: [MatCardModule, MatButtonModule, MatBadgeModule, RouterLink],
  templateUrl: "./day-off-to-accept.component.html",
  styleUrl: "./day-off-to-accept.component.scss",
})
export class DayOffToAcceptComponent {
  days = signal<number>(0);
  service = inject(DashboardService);
  dialog = inject(MatDialog);

  constructor() {
    this.service.getDayOffsToAccept().subscribe((resp) => {
      if (resp.ok) {
        this.days.set(resp.data);
      } else this.service.showError(resp);
    });
  }
}
