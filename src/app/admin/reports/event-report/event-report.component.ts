import { Component, signal } from "@angular/core";
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { InputFilters } from "../../../components/search/model";

@Component({
  selector: "app-event-report",
  imports: [DataTableComponent],
  templateUrl: "./event-report.component.html",
  styleUrl: "./event-report.component.scss",
})
export class EventReportComponent {
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
}
