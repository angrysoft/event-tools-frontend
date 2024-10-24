import { SelectionModel } from "@angular/cdk/collections";
import { Component, inject, signal, ViewChild } from "@angular/core";
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
import { WorkerBase } from "../../admin/models/worker";
import { WorkersService } from "../../admin/services/workers.service";
import { DataTablePaginatorIntl } from "../data-table/data-table.component";
import { LoaderComponent } from "../loader/loader.component";
import { InputFilters, SearchQuery } from "../search/model";
import { SearchComponent } from "../search/search.component";
import { DataTableDataSource } from "./data-table-datasource";
import { WorkerChooserConfig } from "./worker-chooser-config";

@Component({
  selector: "app-worker-chooser",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    LoaderComponent,
    SearchComponent,
    MatDialogActions,
    MatDialogClose,
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
  selection = new SelectionModel<WorkerBase>(true, []);
  selectedWorkers = signal<Set<WorkerBase>>(new Set());
  config: WorkerChooserConfig = inject(MAT_DIALOG_DATA);

  tableColumns = [
    { name: "id", def: "id" },
    { name: "Imię", def: "firstName" },
    { name: "Nazwisko", def: "lastName" },
    { name: "Ekipa", def: "teamName" },
    { name: "Grupa", def: "groupName" },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<WorkerBase>;
  dataSource!: DataTableDataSource<WorkerBase>;

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  constructor() {
    this.dataSource = new DataTableDataSource<WorkerBase>(this.service);
  }

  ngOnInit(): void {
    this.service.api = "/api/admin/workers";
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.service.getWorkersHints().subscribe((resp) => {
      if (resp.ok) {
        this.filters.set({
          team: { name: "Ekipa", values: resp.data.teams.map((t) => t.name) },
          group: { name: "Grupa", values: resp.data.groups.map((t) => t.name) },
        });
      }
    });
  }

  onClick(row: any) {
    if (this.config.single) {
      this.selectedWorkers.set(new Set([row]));
    } else {
      this.selectedWorkers.update((sel) => {
        if (sel.has(row)) sel.delete(row);
        else sel.add(row);
        return sel;
      });
    }
  }

  searchQuery(q: SearchQuery) {
    this.dataSource.query = q;
    this.paginator.firstPage();
    this.dataSource.loadData();
  }

  resetSearch() {
    this.dataSource.query = {};
    this.paginator.firstPage();
    this.dataSource.loadData();
  }
}
