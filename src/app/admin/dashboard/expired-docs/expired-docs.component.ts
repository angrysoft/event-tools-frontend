import { Component, inject, signal } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { WorkerDoc } from "../../../models/worker-doc";
import { DashboardService } from "../../../services/dashboard.service";
import { MatDialog } from "@angular/material/dialog";
import { ExpiredDoscListComponent } from "./expired-dosc-list/expired-dosc-list.component";

@Component({
  selector: "app-expired-docs",
  imports: [MatCardModule, MatButtonModule, MatBadgeModule],
  templateUrl: "./expired-docs.component.html",
  styleUrl: "./expired-docs.component.scss",
})
export class ExpiredDocsComponent {
  docs = signal<WorkerDoc[]>([]);
  service = inject(DashboardService);
  dialog = inject(MatDialog);

  constructor() {
    this.service.getWorkerExpiredDocs().subscribe((resp) => {
      if (resp.ok) {
        this.docs.set(resp.data);
      } else this.service.showError(resp);
    });
  }

  get docCount() {
    return this.docs().length;
  }

  showList() {
    this.dialog.open(ExpiredDoscListComponent, {
      data: { docs: this.docs() },
    });
  }
}
