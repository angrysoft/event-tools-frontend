import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { WorkerDoc, WorkerDocData } from "../models/worker-doc";

@Injectable({
  providedIn: "root",
})
export class DocsService extends CrudService<WorkerDoc> {
  constructor() {
    super();
    this.api = "/api/admin/workers/doc";
  }

  getWorkersDocs(workerId: number): Observable<RestResponse<WorkerDoc[]>> {
    return this._get<RestResponse<WorkerDoc[]>>(this.api, {
      workerId: workerId,
    });
  }

  updateDoc(docId: number, doc: Partial<WorkerDocData>) {
    return this.update(docId, this.prepareDate(doc));
  }

  createDoc(doc: Partial<WorkerDocData>) {
    return this.create(this.prepareDate(doc));
  }

  deleteDoc(workerId: number, docId: number) {
    return this.http
      .delete<RestResponse<void | string>>(
        `/api/admin/workers/${workerId}/doc/${docId}`,
      )
      .pipe(catchError(this.handleError));
  }

  private prepareDate(doc: Partial<WorkerDocData>): FormData {
    const formData = new FormData();
    if (doc.id) {
      formData.set("id", doc.id.toString());
    }

    formData.set("name", doc.name ?? "");

    if (doc.expire && !(doc.expire instanceof Date)) {
      doc.expire = new Date(doc.expire as string);
    }

    formData.set("expire", doc.expire?.toLocaleDateString() ?? "");
    formData.set("expirationDate", doc.expirationDate?.toString() ?? "false");
    if (doc.file) formData.set("file", doc.file);
    formData.set("worker", doc.worker?.toString() ?? "");
    return formData;
  }
}
