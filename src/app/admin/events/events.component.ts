import { Component, inject, signal } from "@angular/core";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { InputFilters } from "../../components/search/model";
import { EventDaysService } from "../../services/event-days.service";

@Component({
  selector: "app-events",
  imports: [DataTableComponent],
  templateUrl: "./events.component.html",
  styleUrl: "./events.component.scss",
})
export class EventsComponent {
  service = inject(EventDaysService);
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];

  constructor() {
    this.service.getStatuses().subscribe((resp) => {
      if (resp.ok) {
        console.log(resp.data);
        const states: { name: string; value: string }[] = [];
        for (const entry of Object.entries(resp.data)) {
          states.push({
            name: entry[1],
            value: entry[0],
          });
        }
        this.inputFilters.set({
          state: { name: "Status Dni", values: states },
          hasOnlyState: {
            name: "Dni tylko ze statusem",
            values: [{ name: "Tak", value: "true" }],
          },
        });
      }
    });
  }
}
