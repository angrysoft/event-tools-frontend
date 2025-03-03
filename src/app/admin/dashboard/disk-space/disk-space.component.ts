import { Component, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DashboardService } from "../../../services/dashboard.service";
import { DiskSpace } from "../../../models/dashboard";

@Component({
  selector: "app-disk-space",
  imports: [MatCardModule, MatProgressBarModule],
  templateUrl: "./disk-space.component.html",
  styleUrl: "./disk-space.component.scss",
})
export class DiskSpaceComponent {
  diskSpace = signal<DiskSpace>({
    total: "0",
    used: "0",
    avail: "0",
    percent: 0
  })
  service = inject(DashboardService);
  
    constructor() {
      this.service.getDiskSpaceInfo().subscribe((resp) => {
        if (resp.ok) {
          this.diskSpace.set(resp.data);
        } else this.service.showError(resp);
      });
    }
}


