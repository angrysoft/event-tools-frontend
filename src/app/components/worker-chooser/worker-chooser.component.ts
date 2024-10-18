import { SelectionModel } from "@angular/cdk/collections";
import {
  Component,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { WorkerBase } from "../../admin/models/worker";
import { DataTablePaginatorIntl } from "../data-table/data-table.component";
import { LoaderComponent } from "../loader/loader.component";
import { InputFilters, SearchQuery } from "../search/model";
import { SearchComponent } from "../search/search.component";
import { DataTableDataSource } from "./data-table-datasource";
import { WorkersService } from "../../admin/services/workers.service";
import { MatButtonModule } from "@angular/material/button";

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
  ],
  templateUrl: "./worker-chooser.component.html",
  styleUrl: "./worker-chooser.component.scss",
  providers: [{ provide: MatPaginatorIntl, useClass: DataTablePaginatorIntl }],
})
export class WorkerChooserComponent<T> {
  readonly service = inject(WorkersService);
  readonly router = inject(Router);
  itemIdName = input<string>("id");
  search = input<boolean>(false);
  approve = output<Set<WorkerBase>>();
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
  single = input<boolean>(false);
  selection = new SelectionModel<WorkerBase>(true, []);
  selectedWorkers = signal<Set<WorkerBase>>(new Set());

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
    if (this.single()) {
      this.selectedWorkers.set(new Set([row]));
      console.log(this.selectedWorkers());
      return;
    }
    if (this.selectedWorkers().has(row)) {
      this.selectedWorkers().delete(row);
    } else {
      this.selectedWorkers().add(row);
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

  emitApprove() {
    this.approve.emit(new Set(this.selectedWorkers()));
  }
}
