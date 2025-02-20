import {
  AfterViewInit,
  Component,
  inject,
  Injectable,
  input,
  OnInit,
  viewChild,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { CrudService } from "../../services/crud.service";
import { AddButtonComponent } from "../add-button/add-button.component";
import { LoaderComponent } from "../loader/loader.component";
import { InputFilters, SearchQuery } from "../search/model";
import { SearchComponent } from "../search/search.component";
import { DataTableDataSource } from "./data-table-datasource";

@Injectable()
export class DataTablePaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`Pierwsza`;
  itemsPerPageLabel = $localize`Ilość na stronie:`;
  lastPageLabel = $localize`Ostatni`;

  nextPageLabel = "Następna";
  previousPageLabel = "Poprzednia";

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Strona 1 z 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Strona ${page + 1} z ${amountPages}`;
  }
}

@Component({
  selector: "app-data-table",
  imports: [
    AddButtonComponent,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    LoaderComponent,
    SearchComponent,
  ],
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  providers: [{ provide: MatPaginatorIntl, useClass: DataTablePaginatorIntl }],
})
export class DataTableComponent<T> implements AfterViewInit, OnInit {
  readonly service = inject(CrudService<T>);
  readonly router = inject(Router);
  itemIdName = input<string>("id");
  search = input<boolean>(false);
  filters = input<InputFilters>();
  showAddButton = input<boolean>(true);
  api = input.required<string>();

  actionsUrl = input.required<string>();
  actionsData = input<{ [key: string]: string } | undefined>();

  tableColumns = input.required<{ name: string; def: string }[]>();

  readonly paginator = viewChild.required(MatPaginator);
  readonly table = viewChild.required(MatTable);
  dataSource!: DataTableDataSource<T>;

  get columnNames() {
    return this.tableColumns().map((el) => el.def);
  }

  constructor() {
    this.dataSource = new DataTableDataSource<T>(this.service);
  }

  ngOnInit(): void {
    this.service.api = this.api();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.table().dataSource = this.dataSource;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick(row: any) {
    if (this.actionsData()) {
      this.router.navigateByUrl(
        `${this.actionsUrl()}/${row[this.itemIdName()]}`,
        { state: this.actionsData() }
      );
    } else {
      this.router.navigateByUrl(
        `${this.actionsUrl()}/${row[this.itemIdName()]}`
      );
    }
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
}
