import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { WorkerSchedule } from "../../models/schedule";
import { ScheduleService } from "../../services/schedule.service";
import { SearchQuery } from "../search/model";

export class ScheduleDataSource extends DataSource<TableData> {
  private readonly dataSubject = new BehaviorSubject<TableData[]>([]);
  public loading = signal<boolean>(false);
  // paginator: MatPaginator | undefined;
  totalElements: number = 0;
  defaultPageSize: number = 15;
  query: SearchQuery = {};

  constructor(private readonly service: ScheduleService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<TableData[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  loadData(dataIn: WorkerSchedule[]) {
    this.loading.set(true);
    const data: TableData[] = [];
    for (const row of dataIn) {
      const days = row.days;
      
      data.push({ ...row.days, workerName: row.workerName });
    }
    this.dataSubject.next(data);
    this.loading.set(false);
  }
}

interface TableData {
  [key: string]: any;
}
