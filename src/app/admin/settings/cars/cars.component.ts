import { Component } from "@angular/core";
import { DataTableComponent } from "../../../components/data-table/data-table.component";

@Component({
  selector: "app-cars",
  imports: [DataTableComponent],
  templateUrl: "./cars.component.html",
  styleUrl: "./cars.component.scss",
})
export class CarsComponent {
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Nazwa", def: "name" },
    { name: "Rejestracja", def: "registration" },
  ];

  filters = {
    company: {
      name: "Firmowe",
      values: [
        { name: "Tak", value: "true" },
        { name: "Nie", value: "false" }
      ],
    },
  }
}
