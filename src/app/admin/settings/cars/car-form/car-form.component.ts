import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Car, CarForm } from "../../../../models/car";
import { CarsService } from "../../../services/cars.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-car-form",
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormBaseComponent,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  templateUrl: "./car-form.component.html",
  styleUrl: "./car-form.component.scss",
})
export class CarFormComponent {
  service = inject(CarsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  update = signal<boolean>(false);
  backTo = "/admin/settings/cars";
  formTitle = "Dane Auta";
  companyCarForm: FormGroup<CarForm>;

  constructor() {
    this.companyCarForm = new FormGroup<CarForm>({
      id: new FormControl(null),
      workerId: new FormControl(null),
      name: new FormControl(null, Validators.required),
      registration: new FormControl(null, Validators.required),
      company: new FormControl(true, Validators.required),
    });

    const paramCarId = this.route.snapshot.paramMap.get("car");
    if (paramCarId) {
      this.backTo = "/admin/settings/cars/" + paramCarId;
      this.update.set(true);
      this.service.get(Number(paramCarId)).subscribe((resp) => {
        if (resp.ok) {
          this.companyCarForm.patchValue(resp.data);
        } else this.service.showError(resp);
      });
    }
  }

  handleSubmit() {
    if (this.update() && this.companyCarForm.value.id) {
      this.service
        .update(this.companyCarForm.value.id, this.companyCarForm.value as Car)
        .subscribe((resp) => {
          if (resp.ok) {
            this.router.navigateByUrl(
              `/admin/settings/cars/${this.companyCarForm.value.id}`,
              {
                replaceUrl: true,
              }
            );
          } else this.service.showError(resp);
        });
    } else {
      this.service
        .create(this.companyCarForm.value as Car)
        .subscribe((resp) => {
          if (resp.ok) {
            this.router.navigateByUrl(`/admin/settings/cars/${resp.data}`);
          } else this.service.showError(resp);
        });
    }
  }
}
