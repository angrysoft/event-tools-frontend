import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CrudService } from "../../services/crud.service";
import { MatPaginator } from "@angular/material/paginator";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";

export class DataTableDataSource<T> extends DataSource<T> {
  private readonly dataSubject = new BehaviorSubject<T[]>([]);
  public loading = signal<boolean>(false);
  paginator: MatPaginator | undefined;

  count: number = 0;
  tabelFilter: string = "";
  defaultPageSize: number = 15;

  constructor(private readonly crudService: CrudService<T>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this.paginator?.page.subscribe(() => {
      this.loadData();
    });
    this.loadData();
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  loadData(opts: { query?: string; filter?: string | null } | null = null) {
    this.loading.set(true);
    const offset =
      (this.paginator?.pageIndex ?? 0) *
      (this.paginator?.pageSize ?? this.defaultPageSize);

    let action: Observable<RestResponse<DataListResponse<T>>>;
    let params: { limit: number; offset: number; filter?: string } = {
      limit: this.paginator?.pageSize ?? this.defaultPageSize,
      offset: offset,
    };

    if (opts?.filter) {
      params = { ...params, filter: opts.filter };
    }

    if (opts?.query && opts.query.length > 0) {
      action = this.crudService.search(opts.query, params);
    } else {
      action = this.crudService.getAll(params);
    }

    action.subscribe((result) => {
      this.count = result?.data?.count;
      this.dataSubject.next(result.data.items);
      this.loading.set(false);
    });
  }
}
