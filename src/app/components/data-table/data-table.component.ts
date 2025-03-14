import {
  Component,
  inject,
  Injectable,
  input,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
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
export class DataTableComponent<T> implements OnInit {
  readonly service = inject(CrudService<T>);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

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
  pageSize = 15;
  pageIndex = 0;
  query = {};
  initSearchValue = signal<{ [key:string]: string }>({ query: "" });
  url = "";

  get columnNames() {
    return this.tableColumns().map((el) => el.def);
  }

  constructor() {
    this.dataSource = new DataTableDataSource<T>(this.service);
    this.url = this.router.url.split("?")[0];
    const query: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(
      this.route.snapshot.queryParams
    )) {
      switch (key) {
        case "page":
          this.pageIndex = Number(value);
          break;
        case "items":
          this.pageSize = Number(value);
          break;
        default:
          query[key] = value;
          break;
      }
    }
    this.query = query;
    this.initSearchValue.set(query);
  }

  onPageChange(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  ngOnInit(): void {
    this.service.api = this.api();
    this.paginator().initialized.subscribe(() => {
      this.paginator().pageIndex = this.pageIndex;
      this.paginator().pageSize = this.pageSize;
    });
    this.dataSource.query = this.query;
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
      const qParams = new URLSearchParams({
        ...this.query,
        page: this.pageIndex.toString(),
        items: this.pageSize.toString(),
      });
      const backTo = `${this.url}?${qParams.toString()}`;

      this.router.navigateByUrl(
        `${this.actionsUrl()}/${row[this.itemIdName()]}`,
        {
          state: {
            backTo: backTo,
          },
        }
      );
    }
  }

  searchQuery(q: SearchQuery) {
    this.query = q;
    this.dataSource.query = q;
    this.paginator().firstPage();
    this.dataSource.loadData();
  }

  resetSearch() {
    this.query = {};
    this.dataSource.query = {};
    this.paginator().firstPage();
    this.dataSource.loadData();
  }
}
