import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CrudService } from "../../../services/crud.service";

export class ListDataSource<T> extends DataSource<T> {
  private readonly listSubject = new BehaviorSubject<T[]>([]);
  public query = "";
  public loading = signal<boolean>(false);

  count: number = 0;
  tabelFilter: string = "";

  constructor(private readonly crudService: CrudService<T>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this.loadData();
    return this.listSubject.asObservable();
  }

  disconnect(): void {
    this.listSubject.complete();
  }

  loadData() {
    this.loading.set(true);
    
    this.crudService.getAll().subscribe((result) => {
      this.listSubject.next(result.data.items);
      this.loading.set(false);
    });
  }
}
