import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionToolbarComponent } from "../../../../components/action-toolbar/action-toolbar.component";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { LoaderComponent } from "../../../../components/loader/loader.component";
import { Car } from "../../../../models/car";
import { CarsService } from "../../../services/cars.service";
import { CarDocsComponent } from "../car-docs/car-docs.component";

@Component({
  selector: "app-show-car",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    CarDocsComponent
],
  templateUrl: "./show-car.component.html",
  styleUrl: "./show-car.component.scss",
})
export class ShowCarComponent {
  dialog = inject(MatDialog);
  service = inject(CarsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  loading = signal<boolean>(true);

  carId = Number(this.route.snapshot.paramMap.get("car") ?? -1);
  tabIndex = Number(this.route.snapshot.queryParamMap.get("tab") ?? "0");

  carData = signal<Car>({
    id: null,
    workerId: 0,
    name: "",
    registration: "",
    company: false,
  });

  constructor() {
    this.service.get(this.carId).subscribe((resp) => {
      if (resp.ok) {
        this.carData.set(resp.data);
      } else this.service.showError(resp);
      this.loading.set(false);
    });
  }

  edit() {
    this.router.navigateByUrl(`/admin/settings/cars/edit/${this.carId}`);
  }

  removeCar() {
    const removeConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno usunąć auto ?" },
    });

    removeConfirm.afterClosed().subscribe((result) => {
      if (result === true && this.carId > 0) {
        this.service.delete(this.carId).subscribe((resp) => {
          if (resp) {
            this.router.navigateByUrl("/admin/settings/cars", {
              replaceUrl: true,
            });
          } else this.service.showError(resp);
        });
      }
    });
  }
}
