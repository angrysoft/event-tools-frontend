import {
  Component,
  effect,
  inject,
  input,
  signal,
  OnInit,
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
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Car, CarForm } from "../../../../models/car";
import { CarsService } from "../../../services/cars.service";

@Component({
  selector: "app-car-form",
  imports: [
    FormBaseComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./car-form.component.html",
  styleUrl: "./car-form.component.scss",
})
export class CarFormComponent implements OnInit {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  readonly service = inject(CarsService);
  readonly route = inject(ActivatedRoute);
  private readonly _snackBar = inject(MatSnackBar);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  carForm: FormGroup<CarForm>;
  carId = signal<number>(-1);
  formTitle = input<string>("Dane Auta");
  backTo = signal<string>("/admin/workers");

  constructor() {
    const paramCarId = this.route.snapshot.paramMap.get("carId");
    if (paramCarId) {
      this.update.set(true);
      this.carId.set(Number(paramCarId));
    }

    this.carForm = new FormGroup<CarForm>({
      id: new FormControl(null),
      workerId: new FormControl(-1, Validators.required),
      name: new FormControl("", [Validators.required]),
      registration: new FormControl("", [
        Validators.required,
        Validators.maxLength(8),
      ]),
      company: new FormControl(false),
    });

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.carForm.patchValue({ workerId: Number(paramWorkerId) });
      this.backTo.set(`/admin/workers/${paramWorkerId}`);
    }

    effect(() => {
      if (this.carId() >= 0) {
        this.service.get(this.carId()).subscribe((resp) => {
          if (resp.ok) {
            this.carForm.patchValue(resp.data);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.carForm.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(formEvents.status === "VALID" && this.carForm.dirty);
      }
    });
  }

  handleSubmit() {
    if (this.carForm.valid) {
      if (this.update()) this.updateCar();
      else this.addCar();
    }
  }

  updateCar() {
    this.service
      .update(this.carId(), this.carForm.value as Car)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=2");
        else this.service.showError(resp);
      });
  }

  addCar() {
    this.service.create(this.carForm.value as Car).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=2");
      else this.service.showError(resp);
    });
  }

  deleteRate() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.carId()) {
        this.service.delete(this.carId()).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl(this.backTo());
          }
        });
      }
    });
  }
}
