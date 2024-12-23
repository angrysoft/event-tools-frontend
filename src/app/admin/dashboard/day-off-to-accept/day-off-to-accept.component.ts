import { Component, inject, signal } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { DayOff } from "../../../models/schedule";
import { DashboardService } from "../../../services/dashboard.service";
import { RouterLink } from "@angular/router";

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

  showList() {
    // this.dialog.open(ExpiredDoscListComponent, {
    //   data: { docs: this.days() },
    // });
    console.log(this.days());
  }
}
