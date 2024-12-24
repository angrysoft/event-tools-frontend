import { Component, signal } from "@angular/core";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { InputFilters } from "../../components/search/model";

@Component({
  selector: "app-plan-execution-report",
  imports: [DataTableComponent],
  templateUrl: "./plan-execution-report.component.html",
  styleUrl: "./plan-execution-report.component.scss",
})
export class PlanExecutionReportComponent {
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
}
