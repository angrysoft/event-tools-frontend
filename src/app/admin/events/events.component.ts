import { Component, signal } from "@angular/core";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { InputFilters } from "../../components/search/model";

@Component({
    selector: "app-events",
    imports: [DataTableComponent],
    templateUrl: "./events.component.html",
    styleUrl: "./events.component.scss"
})
export class EventsComponent {
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
}
