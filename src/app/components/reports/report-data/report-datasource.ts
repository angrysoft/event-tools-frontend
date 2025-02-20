import { DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { BehaviorSubject, Observable } from "rxjs";

export class ReportDataSource<T> extends DataSource<T> {
  private readonly dataSubject = new BehaviorSubject<T[]>([]);
  public loading = signal<boolean>(false);
  length: number = 0;
  selected = [MatTableModule];
  constructor() {
    super();
  }

  connect(): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  loadData(data: T[]) {
    this.loading.set(true);
    this.dataSubject.next(data);
    this.length = data.length;
    this.loading.set(false);
  }
}
