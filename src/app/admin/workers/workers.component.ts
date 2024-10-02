import { AfterViewInit, Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { SearchComponent } from "../../components/search/search.component";
import { WorkersService } from "../services/workers.service";

@Component({
  selector: "app-workers",
  templateUrl: "./workers.component.html",
  styleUrl: "./workers.component.scss",
  standalone: true,
  imports: [SearchComponent, RouterLink, DataTableComponent],
})
export class WorkersComponent implements AfterViewInit {
  teamFilter = signal<{ name: string }[]>([]);
  readonly router = inject(Router);
  readonly workerService = inject(WorkersService);
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Imię", def: "firstName" },
    { name: "Nazwisko", def: "lastName" },
    { name: "Ekipa", def: "team" },
  ];

  ngAfterViewInit(): void {
    this.workerService.getWorkersHints().subscribe((resp) => {
      if (resp.ok) {
        this.teamFilter.set(resp.data.teams);
      }
    });
  }
}
