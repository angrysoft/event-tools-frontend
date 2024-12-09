import { Component, inject, input, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { RateValueDto } from "../../models/rate";
import { BasicPay } from "../../../models/worker";
import { RatesService } from "../../services/rates.service";

@Component({
  selector: "app-rates",
  imports: [
    MatCardModule,
    RouterLink,
    MatButtonModule,
    MatIcon,
    MatDividerModule,
  ],
  templateUrl: "./rates.component.html",
  styleUrl: "./rates.component.scss",
})
export class RatesComponent implements OnInit {
  readonly confirm = inject(MatDialog);
  service = inject(RatesService);
  workerId = input.required<number>();
  basicPay = input.required<BasicPay>();
  workerRates = signal<RateValueDto[]>([]);

  ratesWithBase = [
    "CONSTANT_RATE",
    "BASE_OVERTIME_RATE",
    "BASE_OVERTIME_ADDON",
  ];

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
              this.workerRates().filter((rate) => rate.id !== rateValueId)
            );
          } else this.service.showError(response);
        });
      }
    });
  }
}
