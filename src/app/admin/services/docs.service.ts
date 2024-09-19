import { Injectable } from "@angular/core";
import { CrudService } from "../../services/crud.service";
import { Doc } from "../models/doc";

@Injectable({
  providedIn: "root",
})
export class DocsService extends CrudService<Doc> {
  constructor() {
    super();
    this.setApi("/api/admin/workers/doc");
  }
}
