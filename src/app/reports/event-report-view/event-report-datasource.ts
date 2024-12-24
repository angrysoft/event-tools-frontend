import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { WorkerDay } from "../../models/events";

export class EventReportDataSource extends DataSource<WorkerDay> {
  private readonly dataSubject = new BehaviorSubject<WorkerDay[]>([]);
  public loading = signal<boolean>(false);
  length: number = 0;
  selected = []
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

    const days = workerDays.map((d) => {
      d.addons = d.workerDayAddons
        .map((addon) => `${addon.name}:${addon.money}`)
        .join("\n");
      return d;
    });
    this.loading.set(true);
    this.dataSubject.next(days);
    this.length = workerDays.length;
    this.loading.set(false);
  }
}
