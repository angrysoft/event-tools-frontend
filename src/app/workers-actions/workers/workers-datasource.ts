import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import {
  BehaviorSubject,
  Observable,
  merge,
  of as observableOf,
  of,
} from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { WorkersItem } from "../../models/worker-item";
import { WorkersService } from "../../services/workers.service";

export class WorkersDataSource extends DataSource<WorkersItem> {
  private workersSubject = new BehaviorSubject<WorkersItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

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
    this.loadingSubject.complete();
  }

  loadData() {
    this.loadingSubject.next(true);
    const offset =
      (this.paginator?.pageIndex ?? 0) * (this.paginator?.pageSize ?? 15);
    this.workerService
      .getWorkers(this.paginator?.pageSize, offset)

      .subscribe((result) => {
        this.count = result?.data?.count;
        this.workersSubject.next(result.data.items);
        this.loadingSubject.next(false);
      })
      .add(() => this.loadingSubject.next(false));
  }
}
