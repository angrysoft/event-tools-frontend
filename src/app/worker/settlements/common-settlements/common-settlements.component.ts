import { Component, signal } from '@angular/core';
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { InputFilters } from '../../../components/search/model';

@Component({
  selector: "app-common-settlements",
  imports: [DataTableComponent],
  templateUrl: "./common-settlements.component.html",
  styleUrl: "./common-settlements.component.scss",
})
export class CommonSettlementsComponent {
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Numer", def: "number" },
    { name: "Nazwa", def: "name" },
    { name: "Koordynator", def: "coordinatorName" },
  ];
}
