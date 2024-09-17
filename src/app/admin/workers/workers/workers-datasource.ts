import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { WorkersService } from "../../../services/workers.service";
import { signal } from "@angular/core";
import { RestResponse } from "../../../models/rest-response";
import { WorkersItem, WorkersResponse } from "../../../models/workers-response";

export class WorkersDataSource extends DataSource<WorkersItem> {
  private workersSubject = new BehaviorSubject<WorkersItem[]>([]);
  public query = "";
  public loading = signal<boolean>(false);

  paginator: MatPaginator | undefined;
  count: number = 0;

  constructor(private workerService: WorkersService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<WorkersItem[]> {
    this.paginator?.page.subscribe(() => this.loadData());
    return this.workersSubject.asObservable();
  }

  disconnect(): void {
    this.workersSubject.complete();
  }

  loadData() {
    this.loading.set(true);
    const offset =
      (this.paginator?.pageIndex ?? 0) * (this.paginator?.pageSize ?? 15);

    let action: Observable<RestResponse<WorkersResponse>>;

    if (this.query.length > 2) {
      action = this.workerService.searchWorker(this.query);
    } else {
      action = this.workerService.getWorkers(this.paginator?.pageSize, offset);
    }
    action.subscribe((result) => {
      this.count = result?.data?.count;
      this.workersSubject.next(result.data.items);
      this.loading.set(false);
    });
  }
}
