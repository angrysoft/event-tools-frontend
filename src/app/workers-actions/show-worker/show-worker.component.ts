import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Worker } from "../../models/worker";
import { WorkersService } from "../../services/workers.service";
import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";

export interface DialogData {
  workerId: number;
  remove: false;
}

@Component({
  selector: "app-show-worker",
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    MatDialogModule,
  ],
  templateUrl: "./show-worker.component.html",
  styleUrl: "./show-worker.component.scss",
})
export class ShowWorkerComponent {
  worker: Worker = {
    firstName: "",
    lastName: "",
    id: 0,
    phone: "",
    email: "",
    nickname: null,
    color: null,
    username: null,
    teamId: null,
    groupId: null,
    hasAccount: false,
    secondName: null,
    pesel: null,
    docNumber: null,
  };

  readonly confirm = inject(MatDialog);
  readonly workerService: WorkersService = inject(WorkersService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  constructor() {
    const workerId = Number(this.route.snapshot.paramMap.get("id"));
    this.workerService.getWorker(workerId).subscribe((response) => {
      if (response.ok) {
        this.worker = response.data;
      }
    });
  }

  removeWorker() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Pracownika jest to operacja nieodwracalna" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.worker.id) {
        this.workerService
          .removeWorker(this.worker.id)
          .subscribe((response) => {
            console.log(response);
            if (response.ok) {
              this.router.navigateByUrl("/workers");
            }
          });
      }
    });
  }
}
