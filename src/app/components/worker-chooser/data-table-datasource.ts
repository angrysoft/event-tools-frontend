import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { Page } from "../../models/page";
import { SearchQuery } from "../search/model";

export class DataTableDataSource<T> extends DataSource<T> {
  private readonly dataSubject = new BehaviorSubject<T[]>([]);
  public loading = signal<boolean>(false);
  paginator: MatPaginator | undefined;
  totalElements: number = 0;
  defaultPageSize: number = 15;
  query: SearchQuery = {};

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

  get length() {
    return this.dataSubject.value.length;
  }

  loadData() {
    this.loading.set(true);

    let action: Observable<RestResponse<Page<T>>>;
    let params: { [key: string]: string | number } = {
      pageNumber: this.paginator?.pageIndex ?? 0,
      pageSize: this.paginator?.pageSize ?? this.defaultPageSize,
    };

    if (this.query && Object.keys(this.query).length > 0) {
      action = this.crudService.searchPaged({ ...params, ...this.query });
    } else {
      action = this.crudService.getAllPaged(params);
    }

    action.subscribe((result) => {
      this.totalElements = result.data.page.totalElements;
      this.dataSubject.next(result.data.content);
      this.loading.set(false);
    });
  }
}
