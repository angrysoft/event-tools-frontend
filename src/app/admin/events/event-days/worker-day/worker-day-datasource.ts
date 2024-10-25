import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export class WorkerDayDataSource<WorkerDay> extends DataSource<WorkerDay> {
  private readonly dataSubject = new BehaviorSubject<WorkerDay[]>([]);
  public loading = signal<boolean>(false);
  length: number = 0;

  constructor() {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<WorkerDay[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  loadData(workerDays: WorkerDay[]) {
    this.loading.set(true);
    this.dataSubject.next(workerDays);
    this.length = workerDays.length;
    this.loading.set(false);
  }
}
