import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { InputFilters } from "../../components/search/model";

@Component({
  selector: "app-event-report",
  imports: [DataTableComponent],
  templateUrl: "./event-report.component.html",
  styleUrl: "./event-report.component.scss",
})
export class EventReportComponent {
  route = inject(ActivatedRoute);
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
  api = signal<string>("/api/admin/events");
  actions = signal<string>("/admin/reports/event");
  constructor() {
    const api = this.route.snapshot.data["api"];
    const actions = this.route.snapshot.data["actions"];
    if (api) this.api.set(api);
    if (actions) this.actions.set(actions);
  }
}
