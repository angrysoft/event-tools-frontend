import { Component, inject, input, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { AddonsService } from "../../../admin/services/addons.service";
import { Addon, AddonValue } from "../../../models/addon";

@Component({
  selector: "app-worker-addons",
  imports: [MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: "./worker-addons.component.html",
  styleUrl: "./worker-addons.component.scss",
})
export class WorkerAddonsComponent {
  workerAddons = input.required<AddonValue[]>();
  service = inject(AddonsService);
  addons = signal<{ [key: number]: Addon }>({});

  constructor() {
    this.service.getAllAddons().subscribe((resp) => {
      if (resp.ok) {
        const rates: { [key: number]: Addon } = {};
        resp.data.items.forEach((a) => {
          rates[a.id] = a;
        });
        this.addons.set(rates);
      }
    });
  }

  getAddonName(id: number | null): string {
    if (!id) return "";
    return this.addons()[id]?.name ?? "";
  }

  getAddonType(id: number | null): string {
    if (!id) return "";
    return this.addons()[id]?.addonType ?? "";
  }
}
