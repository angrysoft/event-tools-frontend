import { Component, inject, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { LoaderComponent } from "../../components/loader/loader.component";
import { WorkerChooserConfig } from "../../components/worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../../components/worker-chooser/worker-chooser.component";
import { WorkerBase } from "../../models/worker";
import { WorkerHints } from "../../models/worker-hints";
import { WorkersService } from "../../services/workers.service";
import { dateToString } from "../../utils/date";
import { datesValidator } from "./datesValidator";
import { FromDatesReportPayload } from "../../models/reports";

@Component({
  selector: "app-from-dates-report",
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LoaderComponent,
    MatDatepickerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: "./from-dates-report.component.html",
  styleUrl: "./from-dates-report.component.scss",
  providers: [provideNativeDateAdapter()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FromDatesReportComponent {
  readonly workerService: WorkersService = inject(WorkersService);
  readonly route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  fb = inject(FormBuilder);
  loading = signal<boolean>(true);
  reportSettingsFrom: FormGroup<FromDatesReportSettings>;
  hints: WorkerHints = {
    teams: [],
    groups: [],
    authorities: [],
  };
  reportViewUrl = "/admin/reports/from-dates/view";
  backTo = "/admin/reports/from-dates";

  constructor() {
    const actions = this.route.snapshot.data["actions"];
    if (actions) this.reportViewUrl = actions;

    const backTo = this.route.snapshot.data["backTo"];
    if (backTo) this.backTo = backTo;

    this.workerService.getWorkersHints().subscribe((response) => {
      if (response.ok) {
        this.hints = response.data;
      }
      this.loading.set(false);
    });
    this.reportSettingsFrom = new FormGroup<FromDatesReportSettings>(
      {
        reportType: new FormControl(null, Validators.required),
        teamId: new FormControl(
          { value: null, disabled: true },
          Validators.required
        ),
        workers: this.fb.array([], Validators.required),
        from: new FormControl(new Date(), Validators.required),
        to: new FormControl(new Date(), Validators.required),
      },
      datesValidator()
    );
    this.reportSettingsFrom.controls.workers.disable();
  }

  chooseWorkers() {
    const config: WorkerChooserConfig = {
      single: false,
      search: true,
    };

    const dialogRef = this.dialog.open(WorkerChooserComponent, {
      data: config,
    });

    dialogRef.afterClosed().subscribe((result: Array<WorkerBase> | null) => {
      if (result && result.length > 0) {
        for (const worker of result) {
          this.reportSettingsFrom.controls.workers.push(
            new FormControl(worker)
          );
        }
        this.reportSettingsFrom.controls.workers.markAsDirty();
        this.reportSettingsFrom.controls.workers.updateValueAndValidity();
      }
    });
  }

  removeWorker(idx: number) {
    this.reportSettingsFrom.controls.workers.removeAt(idx);
  }

  onTypeChange(reportType: "team" | "workers") {
    console.log(reportType);

    if (reportType == "team") {
      this.reportSettingsFrom.controls.teamId.enable();
      this.reportSettingsFrom.controls.workers.disable();
    } else if (reportType == "workers") {
      this.reportSettingsFrom.controls.teamId.disable();
      this.reportSettingsFrom.controls.workers.enable();
    }
    this.reportSettingsFrom.updateValueAndValidity();
  }

  handelSubmit() {
    if (!this.reportSettingsFrom.valid) return;

    const data = this.reportSettingsFrom.value;
    const payload: FromDatesReportPayload = {
      reportType: data.reportType ?? null,
      from: "",
      to: "",
      members: [],
      backTo: this.backTo,
    };

    if (data.from && data.to) {
      payload["from"] = dateToString(data.from);
      payload["to"] = dateToString(data.to);
    }

    if (data.reportType == "team" && data.teamId) {
      payload.members = [data.teamId];
    } else if (data.reportType == "workers")
      payload.members = data.workers.map((w: { id: number }) => w.id);

    this.router.navigateByUrl(this.reportViewUrl, {
      state: payload,
    });
  }
}

interface FromDatesReportSettings {
  reportType: FormControl<"team" | "workers" | null>;
  teamId: FormControl<number | null>;
  workers: FormArray;
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}
