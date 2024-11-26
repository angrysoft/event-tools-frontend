import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EventDay, WorkerDay } from "../../../models/events";
import { MatTableModule } from "@angular/material/table";
import { EventWorkerDay } from "../../../models/reports";

export class MonthReportDataSource extends DataSource<DataWorkerDay> {
  private readonly dataSubject = new BehaviorSubject<DataWorkerDay[]>([]);
  public loading = signal<boolean>(false);
  length: number = 0;
  selected = [MatTableModule];
  constructor() {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<DataWorkerDay[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  loadData(eventWorkerDays: EventWorkerDay[]) {

    const workerDays: DataWorkerDay[] = [];

    for (const day of eventWorkerDays) {
      workerDays.push({
        eventName: day.eventName,
        eventNumber: day.eventNumber,
        startTime: day.workerDay.startTime,
        endTime: day.workerDay.endTime,
        workHours: day.workerDay.workHours ?? 0,
        rateName: day.workerDay.rateName ?? "",
        rateValue: day.workerDay.rateValue ?? "",
        addons: day.workerDay.workerDayAddons
          .map((addon) => `${addon.name}:${addon.money}`)
          .join("\n"),
        total: day.workerDay.total ?? "",
      });
    }
    console.log()
    this.loading.set(true);
    this.dataSubject.next(workerDays);
    this.length = workerDays.length;
    this.loading.set(false);
  }
}

interface DataWorkerDay {
  eventName: string;
  eventNumber: string;
  startTime: string | Date;
  endTime: string | Date;
  workHours: number;
  rateName: string;
  rateValue: string;
  addons: string;
  total: string;
}
