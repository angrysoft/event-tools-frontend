import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
} from "@angular/material/dialog";
import { WorkerBase } from "../../models/worker";
import { WorkersService } from "../../services/workers.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-contact",
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
  ],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {
  loading = signal<boolean>(true);
  workerService = inject(WorkersService);
  worker: WorkerBase | null = null;
  readonly data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.workerService
      .getWorkerContact(this.data.worker ?? -1)
      .subscribe((resp) => {
        if (resp.ok) {
          this.worker = resp.data;
        } else this.workerService.showError(resp);
      });
  }
}
