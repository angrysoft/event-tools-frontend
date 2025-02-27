import { Component, inject, input, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { RatesService } from "../../../admin/services/rates.service";
import { Rate, RateValue } from "../../../models/rate";
import { BasicPay } from "../../../models/worker";

@Component({
  selector: "app-worker-rates",
  imports: [MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: "./worker-rates.component.html",
  styleUrl: "./worker-rates.component.scss",
})
export class WorkerRatesComponent {
  readonly confirm = inject(MatDialog);
  service = inject(RatesService);
  basicPay = input.required<BasicPay>();
  rates = input.required<RateValue[]>();
  rateNames = signal<{ [key: number]: Rate }>({});

  ratesWithBase = [
    "CONSTANT_RATE",
    "BASE_OVERTIME_RATE",
    "BASE_OVERTIME_ADDON",
  ];

  constructor() {
    this.service.getAllRates().subscribe((resp) => {
      if (resp.ok) {
        const rates: { [key: number]: Rate } = {};
        resp.data.items.forEach((r) => {
          rates[r.id] = r;
        });
        this.rateNames.set(rates);
      }
    });
  }

  getRateName(id: number | null): string {
    if (!id) return "";
    return this.rateNames()[id]?.name ?? "";
  }

  getRateType(id: number | null): string {
    if (!id) return "";
    return this.rateNames()[id]?.rateType ?? "";
  }
}
