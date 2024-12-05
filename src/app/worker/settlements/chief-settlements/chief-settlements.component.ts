import { Component, signal } from '@angular/core';
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { InputFilters } from '../../../components/search/model';

@Component({
  selector: "app-chief-settlements",
  imports: [DataTableComponent],
  templateUrl: "./chief-settlements.component.html",
  styleUrl: "./chief-settlements.component.scss",
})
export class ChiefSettlementsComponent {
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
}
