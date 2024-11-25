import { Component, inject, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { WorkerHints } from "../../models/worker-hints";
import { WorkersService } from "../../services/workers.service";

@Component({
  selector: "app-workers-report",
  imports: [
    LoaderComponent,
    MatExpansionModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormField,
    MatSelectModule,
  ],
  templateUrl: "./workers-report.component.html",
  styleUrl: "./workers-report.component.scss",
})
export class WorkersReportComponent {
  loading = signal<boolean>(false);
  panelOpenState = signal<boolean>(true);
  readonly workerService: WorkersService = inject(WorkersService);
  fb = inject(FormBuilder);

  reportSettingFrom: FormGroup<ReportSettingForm>;
  hints: WorkerHints = {
    teams: [],
    groups: [],
    authorities: [],
  };

  constructor() {
    this.workerService.getWorkersHints().subscribe((response) => {
      if (response.ok) {
        this.hints = response.data;
      }
    });
    this.reportSettingFrom = new FormGroup<ReportSettingForm>({
      reportType: new FormControl(null, Validators.required),
      teamId: new FormControl({value:null, }, Validators.required),
      workers: this.fb.array([], Validators.required),
    });
  }

  handelSubmit() {
    console.log(this.reportSettingFrom.value);
  }

  chooseWorkers() {
    console.log("choose workers");
  }

  onTypeChange(reportType: "team" | "workers") {
    console.log(reportType);

    if (reportType == "team") {
      this.reportSettingFrom.controls.teamId.enable();
      this.reportSettingFrom.controls.workers.disable();
    } else if (reportType == "workers") {
      this.reportSettingFrom.controls.teamId.disable();
      this.reportSettingFrom.controls.workers.enable();
    }
  }
}

interface ReportSettingForm {
  reportType: FormControl<"team" | "workers" | null>;
  teamId: FormControl<number | null>;
  workers: FormArray;
}

interface WorkerSelection {
  id: number;
  name: string;
}
