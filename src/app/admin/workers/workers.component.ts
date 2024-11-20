import { AfterViewInit, Component, inject, signal } from "@angular/core";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { InputFilters } from "../../components/search/model";
import { WorkersService } from "../services/workers.service";

@Component({
    selector: "app-workers",
    templateUrl: "./workers.component.html",
    styleUrl: "./workers.component.scss",
    imports: [DataTableComponent]
})
export class WorkersComponent implements AfterViewInit {
  inputFilters = signal<InputFilters>({});
  readonly workerService = inject(WorkersService);
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Imię", def: "firstName" },
    { name: "Nazwisko", def: "lastName" },
    { name: "Ekipa", def: "teamName" },
    { name: "Grupa", def: "groupName" },
  ];

  ngAfterViewInit(): void {
    this.workerService.getWorkersHints().subscribe((resp) => {
      if (resp.ok) {
        this.inputFilters.set({
          team: { name: "Ekipa", values: resp.data.teams.map((t) => t.name) },
          group: { name: "Grupa", values: resp.data.groups.map((t) => t.name) },
        });
      }
    });
  }
}
