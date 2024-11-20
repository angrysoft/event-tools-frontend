import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
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
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Rate, RateForm, RateType } from "../../../models/rate";
import { RatesService } from "../../../services/rates.service";
import {AutofocusDirective} from "../../../../directives/autofocus.directive";

@Component({
    selector: "app-rate-form",
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
        AutofocusDirective
    ],
    templateUrl: "./rate-form.component.html",
    styleUrl: "./rate-form.component.scss"
})
export class RateFormComponent implements OnInit, OnDestroy {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  readonly route = inject(ActivatedRoute);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  rateId = signal<number>(-1);
  rateTypes = signal<RateType[]>([]);
  service: RatesService;
  rateForm: FormGroup<RateForm>;
  formTitle = "Stawka";
  private readonly destroy = new Subject();
  readonly backTo = "/admin/settings/rates";

  constructor() {
    this.service = new RatesService();

    this.service.getRateTypes().subscribe((resp) => {
      if (resp.ok) {
        this.rateTypes.set(resp.data.items);
      }
    });

    const paramRateId = this.route.snapshot.paramMap.get("id");
    if (paramRateId) {
      this.update.set(true);
      this.rateId.set(Number(paramRateId));
    }

    this.rateForm = new FormGroup<RateForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      rateType: new FormControl("", [Validators.required]),
      overtimeAfter: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
    });

    effect(() => {
      if (this.rateId() >= 0) {
        this.service.get(this.rateId()).subscribe((resp) => {
          if (resp.ok) {
            this.rateForm.patchValue(resp.data);
            this.verifyRateType();
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.rateForm.events
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        if (formEvents instanceof StatusChangeEvent) {
          this.canSend.set(
            formEvents.status === "VALID" && this.rateForm.dirty,
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (this.rateForm.valid) {
      if (this.update()) this.updateRate();
      else this.addRate();
    }
  }

  updateRate() {
    this.service
      .update(this.rateId(), this.rateForm.value as Rate)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo);
        else this.service.showError(resp);
      });
  }

  addRate() {
    this.service.create(this.rateForm.value as Rate).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo);
      else this.service.showError(resp);
    });
  }

  deleteRate() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.rateId()) {
        this.service.delete(this.rateId()).subscribe((resp) => {
          if (resp.ok) {
            this.router.navigateByUrl(this.backTo);
          } else this.service.showError(resp);
        });
      }
    });
  }

  getRateType() {
    return this.rateTypes()
      .filter((el) => el.name === this.rateForm.controls.rateType.value)
      .at(0)?.value;
  }

  verifyRateType() {
    switch (this.rateForm.controls.rateType.value) {
      case "HOUR_RATE":
      case "BASE_OVERTIME_RATE":
      case "BASE_OVERTIME_ADDON":
        this.rateForm.controls.overtimeAfter.enable();
        break;
      default:
        this.rateForm.controls.overtimeAfter.reset();
        this.rateForm.controls.overtimeAfter.disable();
        break;
    }
    this.rateForm.controls.overtimeAfter.updateValueAndValidity({
      onlySelf: true,
    });
  }
}
