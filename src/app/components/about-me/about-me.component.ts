import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { Worker } from "../../models/worker";
import { WorkersService } from "../../services/workers.service";
import { WorkerCarComponent } from "./worker-car/worker-car.component";
import { WorkerDocsComponent } from "./worker-docs/worker-docs.component";
import { WorkerRatesComponent } from "./worker-rates/worker-rates.component";
import { WorkerAddonsComponent } from "./worker-addons/worker-addons.component";

export interface DialogData {
  workerId: number;
  remove: false;
}

@Component({
  selector: "app-about-me",
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatListModule,
    LoaderComponent,
    ActionToolbarComponent,
    WorkerDocsComponent,
    WorkerCarComponent,
    WorkerRatesComponent,
    WorkerAddonsComponent,
  ],
  templateUrl: "./about-me.component.html",
  styleUrl: "./about-me.component.scss",
})
export class AboutMeComponent {
  readonly workerService: WorkersService = inject(WorkersService);
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
      workers: -1
    },
    desc: "",
    id: null,
    firstName: null,
    lastName: null
  });
  loading = signal<boolean>(true);

  constructor() {
    this.workerService.getAboutMe().subscribe((response) => {
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
}
