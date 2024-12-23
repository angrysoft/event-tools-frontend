import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { DayOff } from "../../models/schedule";
import { WorkerDaysService } from "../../services/worker-days.service";

export class DayOffDataSource extends DataSource<DayOff> {
  private readonly dataSubject = new BehaviorSubject<DayOff[]>([]);
  

  public loading = signal<boolean>(false);
  paginator: MatPaginator | undefined;
  totalElements: number = 0;
  defaultPageSize: number = 15;

  constructor( private readonly service: WorkerDaysService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<DayOff[]> {
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
    this.service
      .getDayOffToAccept(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? this.defaultPageSize
      )
      .subscribe((result) => {
        this.totalElements = result.data.page.totalElements;
        this.dataSubject.next(result.data.content);
        this.loading.set(false);
      });
  }
}
