import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { WorkersItem } from "../../models/worker-item";
import { WorkersService } from "../../services/workers.service";
import { signal } from "@angular/core";

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

    if (this.query.length > 2) {
      this.workerService.searchWorker(this.query).subscribe((result) => {
        // this.count = result?.data?.count;
        this.count = 20;
        this.workersSubject.next(result.data.items);
        this.loading.set(false);
      });
    } else {
      this.workerService
        .getWorkers(this.paginator?.pageSize, offset)

        .subscribe((result) => {
          this.count = result?.data?.count;
          this.workersSubject.next(result.data.items);
          this.loading.set(false);
        });
    }
  }
}
