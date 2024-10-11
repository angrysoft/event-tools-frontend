import { AfterViewInit, Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { SearchComponent } from "../../components/search/search.component";
import { WorkersService } from "../services/workers.service";
import { InputFilters } from "../../components/search/model";

@Component({
  selector: "app-workers",
  templateUrl: "./workers.component.html",
  styleUrl: "./workers.component.scss",
  standalone: true,
  imports: [SearchComponent, RouterLink, DataTableComponent],
})
export class WorkersComponent implements AfterViewInit {
  inputFilters = signal<InputFilters>({});
  readonly router = inject(Router);
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
