import {
  AfterViewInit,
  Component,
  inject,
  input,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddButtonComponent } from "../../../components/add-button/add-button.component";
import { CrudService } from "../../../services/crud.service";
import { ListDataSource } from "./list-datasource";

@Component({
  selector: "app-setting-list",
  standalone: true,
  imports: [AddButtonComponent, MatTableModule, MatProgressSpinnerModule],
  templateUrl: "./setting-list.component.html",
  styleUrl: "./setting-list.component.scss",
})
export class SettingListComponent<T> implements AfterViewInit, OnInit {
  readonly service = inject(CrudService<T>);
  readonly router = inject(Router);
  @Input({ required: true })
  api = "";

  @Input({ required: true })
  actionsUrl = "";

  tableColumns = input.required<{name:string, def:string}[]>()

  @ViewChild(MatTable) table!: MatTable<T>;
  dataSource!: ListDataSource<T>;


  get columnNames() {
    return this.tableColumns().map((el)=> el.def);
  }

  constructor() {
    this.dataSource = new ListDataSource<T>(this.service);
  }

  ngOnInit(): void {
    this.service.api = this.api;
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData();
  }

  onClick(row: any) {
    this.router.navigateByUrl(`${this.actionsUrl}/${row.id}`);
  }
}
