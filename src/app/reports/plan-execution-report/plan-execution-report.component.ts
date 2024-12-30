import { Component, inject, signal } from "@angular/core";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { InputFilters } from "../../components/search/model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-plan-execution-report",
  imports: [DataTableComponent],
  templateUrl: "./plan-execution-report.component.html",
  styleUrl: "./plan-execution-report.component.scss",
})
export class PlanExecutionReportComponent {
  private readonly route = inject(ActivatedRoute);
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
  api = signal<string>("/api/admin/events");
  actions = signal<string>("/admin/reports/plan-execution");
  constructor() {
    const api = this.route.snapshot.data["api"];
    const actions = this.route.snapshot.data["actions"];
    if (api) this.api.set(api);
    if (actions) this.actions.set(actions);
  }
}
