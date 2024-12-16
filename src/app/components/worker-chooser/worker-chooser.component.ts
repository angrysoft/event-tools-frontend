import { SelectionModel } from "@angular/cdk/collections";
import { Component, inject, signal, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { WorkerBase } from "../../models/worker";
import { WorkersService } from "../../services/workers.service";
import { DataTablePaginatorIntl } from "../data-table/data-table.component";
import { LoaderComponent } from "../loader/loader.component";
import { InputFilters, SearchQuery } from "../search/model";
import { SearchComponent } from "../search/search.component";
import { WorkerChooseTableDataSource } from "./worker-choose-data-table-datasource";
import { WorkerChooserConfig } from "./worker-chooser-config";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
  selector: "app-worker-chooser",
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    LoaderComponent,
    SearchComponent,
    MatDialogActions,
    MatDialogClose,
    MatCheckboxModule,
  ],
  templateUrl: "./worker-chooser.component.html",
  styleUrl: "./worker-chooser.component.scss",
  providers: [{ provide: MatPaginatorIntl, useClass: DataTablePaginatorIntl }],
})
export class WorkerChooserComponent<T> {
  readonly service = inject(WorkersService);
  readonly router = inject(Router);
  filters = signal<InputFilters>({
    team: {
      name: "",
      values: [],
    },
    group: {
      name: "",
      values: [],
    },
  });
  config: WorkerChooserConfig = inject(MAT_DIALOG_DATA);
  selection = new SelectionModel<WorkerBase>(!this.config.single, [], true);

  tableColumns = [
    { name: "selection", def: "select" },
    { name: "id", def: "id" },
    { name: "Imię", def: "firstName" },
    { name: "Nazwisko", def: "lastName" },
    { name: "Ekipa", def: "teamName" },
    { name: "Grupa", def: "groupName" },
  ];

  readonly paginator = viewChild.required(MatPaginator);
  readonly table = viewChild.required(MatTable);
  dataSource!: WorkerChooseTableDataSource;

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  constructor() {
    this.dataSource = new WorkerChooseTableDataSource(this.service);
  }

  ngOnInit(): void {
    this.service.api = "/api/admin/workers";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.table().dataSource = this.dataSource;

    this.service.getWorkersHints().subscribe((resp) => {
      if (resp.ok) {
        this.filters()["team"] = {
          name: "Ekipa",
          values: resp.data.teams.map((t) => {
            return { name: t.name, value: t.name };
          }),
        };
        this.filters()["group"] = {
          name: "Grupa",
          values: resp.data.groups.map((g) => {
            return { name: g.name, value: g.name };
          }),
        };
      }
    });
  }

  searchQuery(q: SearchQuery) {
    this.dataSource.query = q;
    this.paginator().firstPage();
    this.dataSource.loadData();
  }

  resetSearch() {
    this.dataSource.query = {};
    this.paginator().firstPage();
    this.dataSource.loadData();
  }

  isSelected(row: any) {
    return this.selection.selected.some((el) => el.id === row.id);
  }
}
