import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { Worker } from "../../models/worker";
import { WorkerDoc } from "../../models/worker-doc";
import { WorkersService } from "../../services/workers.service";
import { DocsComponent } from "./docs/docs.component";

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
    MatTabsModule,
    MatListModule,
    DocsComponent
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
    phoneIce: null,
    mother: null,
    father: null,
  };

  readonly confirm = inject(MatDialog);
  readonly workerService: WorkersService = inject(WorkersService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  workerId: number = Number(this.route.snapshot.paramMap.get("id"));

  constructor() {
    // this.workerId = Number(this.route.snapshot.paramMap.get("id"));
    this.workerService.get(this.workerId).subscribe((response) => {
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
          .delete(this.worker.id)
          .subscribe((response) => {
            console.log(response);
            if (response.ok) {
              this.router.navigateByUrl("/admin/workers");
            }
          });
      }
    });
  }

  
}
