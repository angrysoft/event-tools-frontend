import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { Worker } from "../../../models/worker";
import { WorkersService } from "../../../services/workers.service";
import { AddonsComponent } from "../addons/addons.component";
import { CarsComponent } from "../cars/cars.component";
import { DocsComponent } from "../docs/docs.component";
import { RatesComponent } from "../rates/rates.component";
import { WorkerDescComponent } from "../worker-desc/worker-desc.component";

export interface DialogData {
  workerId: number;
  remove: false;
}

@Component({
  selector: "app-show-worker",
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    MatDialogModule,
    MatTabsModule,
    MatListModule,
    DocsComponent,
    RatesComponent,
    LoaderComponent,
    AddonsComponent,
    CarsComponent,
    ActionToolbarComponent,
    WorkerDescComponent
],
  templateUrl: "./show-worker.component.html",
  styleUrl: "./show-worker.component.scss",
})
export class ShowWorkerComponent {
  readonly confirm = inject(MatDialog);
  readonly workerService: WorkersService = inject(WorkersService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  worker = signal<Worker>({
    secondName: null,
    phone: null,
    phoneIce: null,
    mother: null,
    father: null,
    email: null,
    nickname: null,
    color: null,
    username: null,
    teamId: null,
    groupId: null,
    pesel: null,
    docNumber: null,
    hasAccount: null,
    password: null,
    password2: null,
    authority: null,
    workerDoc: [],
    basicPay: {
      value: 0,
      workers: -1,
    },
    desc: "",
    id: null,
    firstName: null,
    lastName: null,
  });
  loading = signal<boolean>(true);

  workerId: number = Number(this.route.snapshot.paramMap.get("id"));
  tabIndex: number = Number(this.route.snapshot.queryParams["tab"] ?? 0);
  backTo = "/admin/workers?back=1";

  constructor() {
    this.workerService.get(this.workerId).subscribe((response) => {
      if (response.ok) {
        const data = response.data;
        if (!response.data.basicPay) {
          data.basicPay = {
            value: 0,
            workers: -1,
          };
        }
        this.worker.set(data);
      }
      this.loading.set(false);
    });
  }

  removeWorker() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Pracownika jest to operacja nieodwracalna" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.worker().id) {
        this.workerService
          .delete(this.worker().id ?? -1)
          .subscribe((response) => {
            if (response.ok) {
              this.router.navigateByUrl("/admin/workers", { replaceUrl: true });
            } else this.workerService.showError(response);
          });
      }
    });
  }

  removeDesc() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usunąć opis ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.worker().id) {
        this.workerService
          .deleteDesc(this.worker().id ?? -1)
          .subscribe((response) => {
            if (response.ok) {
              this.worker().desc = null;
            } else this.workerService.showError(response);
          });
      }
    });
  }
}
