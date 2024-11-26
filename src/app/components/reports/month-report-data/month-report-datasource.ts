import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EventDay, WorkerDay } from "../../../models/events";
import { MatTableModule } from "@angular/material/table";

export class MonthReportDataSource extends DataSource<WorkerDay> {
  private readonly dataSubject = new BehaviorSubject<WorkerDay[]>([]);
  public loading = signal<boolean>(false);
  length: number = 0;
  selected = [MatTableModule]
  constructor() {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<WorkerDay[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  loadData(eventDays: EventDay[]) {
    const workerDays:WorkerDay[] = [];

    for (const eventDay of eventDays) {
      workerDays.push(...eventDay.workerDays.map(wd=>{wd.state = eventDay.state; return wd}));
    }

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
