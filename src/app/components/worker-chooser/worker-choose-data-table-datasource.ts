import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { Page } from "../../models/page";
import { RestResponse } from "../../models/rest-response";
import { WorkersService } from "../../services/workers.service";
import { SearchQuery } from "../search/model";
import { WorkerBase } from "../../models/worker";

export class WorkerChooseTableDataSource extends DataSource<WorkerBase> {
  private readonly dataSubject = new BehaviorSubject<WorkerBase[]>([]);
  public loading = signal<boolean>(false);
  paginator: MatPaginator | undefined;
  totalElements: number = 0;
  defaultPageSize: number = 15;
  query: SearchQuery = {};

  constructor(private readonly workerService: WorkersService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<WorkerBase[]> {
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

    let action: Observable<RestResponse<Page<WorkerBase>>>;
    const params: { [key: string]: string | number } = {
      pageNumber: this.paginator?.pageIndex ?? 0,
      pageSize: this.paginator?.pageSize ?? this.defaultPageSize,
    };

    if (this.query && Object.keys(this.query).length > 0) {
      action = this.workerService.searchWorkerPaged({
        ...params,
        ...this.query,
      });
    } else {
      action = this.workerService.getAllWorkerPaged(params);
    }

    action.subscribe((result) => {
      this.totalElements = result.data.page.totalElements;
      this.dataSubject.next(result.data.content);
      this.loading.set(false);
    });
  }
}
