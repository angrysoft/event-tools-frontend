import { Component, inject, signal } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { DashboardService } from "../../../services/dashboard.service";
import { ExpiredCarDocsListComponent } from "./expired-car-docs-list/expired-car-docs-list.component";

@Component({
  selector: "app-car-expired-docs",
  imports: [MatCardModule, MatBadgeModule, MatButtonModule],
  templateUrl: "./car-expired-docs.component.html",
  styleUrl: "./car-expired-docs.component.scss",
})
export class CarExpiredDocsComponent {
  docs = signal<{[key:string]:string}>({});
  service = inject(DashboardService);
  dialog = inject(MatDialog);

  constructor() {
    this.service.getCarExpiredDocs().subscribe((resp) => {
      if (resp.ok) {
        this.docs.set(resp.data);
      } else this.service.showError(resp);
    });
  }

  get docCount() {
    return Object.keys(this.docs()).length;
  }

  showList() {
    console.log(this.docs());
    this.dialog.open(ExpiredCarDocsListComponent, {
      data: { docs: this.docs() },
    });
  }
}
