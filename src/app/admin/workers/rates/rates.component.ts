import { Component, inject, input, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AddButtonComponent } from "../../../components/add-button/add-button.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { RateValueDto } from "../../models/rate";
import { RatesService } from "../../services/rates.service";

@Component({
  selector: "app-rates",
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    MatButtonModule,
    AddButtonComponent,
    MatIcon,
    MatListModule,
  ],
  templateUrl: "./rates.component.html",
  styleUrl: "./rates.component.scss",
})
export class RatesComponent implements OnInit {
  readonly confirm = inject(MatDialog);
  workerRates = signal<RateValueDto[]>([]);
  workerId = input.required<number>();
  service = inject(RatesService);

  constructor() {}

  ngOnInit(): void {
    this.service.getWorkerRates(this.workerId()).subscribe((resp) => {
      if (resp.ok) {
        this.workerRates.set(resp.data.items);
      }
    });
  }

  removeRateValue(rateValueId: number | null) {
    if (!rateValueId) {
      console.warn("Brakuje doc id");
      return;
    }

    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.service.deleteRateValue(rateValueId).subscribe((response) => {
          if (response.ok) {
            this.workerRates.set(
              this.workerRates().filter((rate) => rate.id !== rateValueId),
            );
          }
        });
      }
    });
  }
}
