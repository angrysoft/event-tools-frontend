import { Component, effect, inject, input, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  StatusChangeEvent,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Rate, RateForm, RateType } from "../../../models/rate";
import { RatesService } from "../../../services/rates.service";

@Component({
  selector: "app-rate-form",
  standalone: true,
  imports: [
    FormBaseComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./rate-form.component.html",
  styleUrl: "./rate-form.component.scss",
})
export class RateFormComponent {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  update: boolean = false;
  canSend = signal<boolean>(false);
  service: RatesService;
  rateForm: FormGroup<RateForm>;
  rateId = signal<number>(-1);
  error = signal<string>("");
  formTitle = input<string>("Dodaj Stawkę");
  rateTypes = signal<RateType[]>([]);
  showOvertime = signal<boolean>(false);
  readonly route = inject(ActivatedRoute);
  private _snackBar = inject(MatSnackBar);

  constructor() {
    this.service = new RatesService();

    this.service.getRateTypes().subscribe((resp) => {
      if (resp.ok) {
        this.rateTypes.set(resp.data.items);
      }
    });

    const paramRateId = this.route.snapshot.paramMap.get("id");
    if (paramRateId) {
      this.rateId.set(Number(paramRateId));
      this.update = true;
    }

    this.rateForm = new FormGroup<RateForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      rateType: new FormControl("", [Validators.required]),
      overtimeAfter: new FormControl(),
    });

    effect(() => {
      if (this.rateId() >= 0) {
        this.service.get(this.rateId()).subscribe((resp) => {
          if (resp.ok) {
            this.rateForm.patchValue(resp.data);
            this.update = true;
            this.verifyRateType();
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.rateForm.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(formEvents.status === "VALID" && this.rateForm.dirty);
      }
    });
  }

  handleSubmit() {
    if (this.rateForm.valid) {
      if (this.update) this.updateRate();
      else this.addRate();
    }
  }

  updateRate() {
    this.service
      .update(this.rateId(), this.rateForm.value as Rate)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl("/admin/settings/rates");
        else this.handleError(resp);
      });
  }

  addRate() {
    this.service.create(this.rateForm.value as Rate).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/rates");
      else this.handleError(resp);
    });
  }

  deleteRate() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.rateId()) {
        this.service.delete(this.rateId()).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/settings/rates");
          }
        });
      }
    });
  }

  handleError(err: any) {
    console.warn(err.error);
    this._snackBar.open(err.data ?? "Coś poszło nie tak...", "Zamknij", {
      verticalPosition: "top",
    });
  }

  verifyRateType() {
    switch (this.rateForm.controls.rateType.value) {
      case "HOUR_RATE":
      case "BASE_OVERTIME_RATE":
        this.showOvertime.set(true);
        this.rateForm.controls.overtimeAfter.addValidators(Validators.required);
        this.rateForm.controls.overtimeAfter.updateValueAndValidity({
          onlySelf: true,
        });
        break;
      default:
        this.showOvertime.set(false);
        this.rateForm.controls.overtimeAfter.reset();
        this.rateForm.controls.overtimeAfter.clearValidators();
        this.rateForm.controls.overtimeAfter.updateValueAndValidity({
          onlySelf: true,
        });
        break;
    }
  }
}
