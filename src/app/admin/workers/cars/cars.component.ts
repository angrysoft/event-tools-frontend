import { Component, inject, signal, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AddButtonComponent } from "../../../components/add-button/add-button.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { Car } from "../../models/car";
import { CarsService } from "../../services/cars.service";

@Component({
  selector: "app-cars",
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    MatButtonModule,
    AddButtonComponent,
    MatIcon,
    MatListModule,
  ],
  templateUrl: "./cars.component.html",
  styleUrl: "./cars.component.scss",
})
export class CarsComponent {
  readonly confirm = inject(MatDialog);
  cars = signal<Car[]>([]);
  workerId = input.required<number>();
  service = inject(CarsService);

  ngOnInit(): void {
    this.service.getWorkerCars(this.workerId()).subscribe((resp) => {
      if (resp.ok) {
        this.cars.set(resp.data.items);
      }
    });
  }

  removeCar(carId: number | null) {
    if (!carId) {
      console.warn("Brakuje car id");
      return;
    }

    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.service.delete(carId).subscribe((response) => {
          if (response.ok) {
            this.cars.set(this.cars().filter((rate) => rate.id !== carId));
          } else this.service.showError(response);
        });
      }
    });
  }
}
