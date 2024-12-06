import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { WorkerChooserConfig } from "../../../components/worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../../../components/worker-chooser/worker-chooser.component";
import { WorkerBase } from "../../models/worker";
import { WorkerHints } from "../../models/worker-hints";
import { WorkersService } from "../../../services/workers.service";

@Component({
  selector: "app-workers-report",
  imports: [
    LoaderComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormField,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./workers-report.component.html",
  styleUrl: "./workers-report.component.scss",
})
export class WorkersReportComponent {
  readonly workerService: WorkersService = inject(WorkersService);
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  loading = signal<boolean>(false);
  step = signal(0);
  panelOpenState = signal<boolean>(true);
  workerName = signal<string>("");

  reportSettingFrom: FormGroup<ReportSettingForm>;
  hints: WorkerHints = {
    teams: [],
    groups: [],
    authorities: [],
  };

  constructor() {
    const date = new Date();
    date.setDate(1);

    this.workerService.getWorkersHints().subscribe((response) => {
      if (response.ok) {
        this.hints = response.data;
      }
    });
    this.reportSettingFrom = new FormGroup<ReportSettingForm>({
      reportType: new FormControl(null, Validators.required),
      teamId: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      worker: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      month: new FormControl(date.getMonth(), Validators.required),
      year: new FormControl(date.getFullYear(), [
        Validators.required,
        Validators.min(2024),
        Validators.minLength(4),
      ]),
    });
  }

  handelSubmit() {
    this.router.navigateByUrl("/admin/reports/workers/view", {
      state: this.reportSettingFrom.value,
    });
  }

  chooseWorkers() {
    const config: WorkerChooserConfig = {
      single: true,
      search: true,
    };

    const dialogRef = this.dialog.open(WorkerChooserComponent, {
      data: config,
    });

    dialogRef.afterClosed().subscribe((result: Array<WorkerBase> | null) => {
      if (result && result.length > 0) {
        const worker = result.at(0);
        this.reportSettingFrom.controls.worker.setValue(Number(worker?.id));
        this.workerName.set(worker?.firstName + " " + worker?.lastName);
        this.reportSettingFrom.controls.worker.markAsDirty();
        this.reportSettingFrom.controls.worker.updateValueAndValidity();
      }
    });
  }

  onTypeChange(reportType: "team" | "worker") {
    console.log(reportType);

    if (reportType == "team") {
      this.reportSettingFrom.controls.teamId.enable();
      this.reportSettingFrom.controls.worker.disable();
    } else if (reportType == "worker") {
      this.reportSettingFrom.controls.teamId.disable();
      this.reportSettingFrom.controls.worker.enable();
    }
    this.reportSettingFrom.updateValueAndValidity();
  }
}

interface ReportSettingForm {
  reportType: FormControl<"team" | "worker" | null>;
  teamId: FormControl<number | null>;
  worker: FormControl<number | null>;
  month: FormControl<number | null>;
  year: FormControl<number | null>;
}
