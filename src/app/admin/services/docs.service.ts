import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { WorkerDoc, WorkerDocData } from "../../models/worker-doc";

@Injectable({
  providedIn: "root",
})
export class DocsService extends CrudService<WorkerDoc> {
  constructor() {
    super();
    this.api = "/api/admin/workers";
  }

  getWorkersDocs(workerId: number): Observable<RestResponse<WorkerDoc[]>> {
    return this._get<RestResponse<WorkerDoc[]>>(`${this.api}/${workerId}/doc`, {
      workerId: workerId,
    });
  }

  getDoc(workerId: number, docId: number): Observable<RestResponse<WorkerDoc>> {
    return this._get<RestResponse<WorkerDoc>>(
      `${this.api}/${workerId}/doc/${docId}`
    ).pipe(catchError(this.handleError));
  }

  updateDoc(
    docId: number,
    doc: Partial<WorkerDocData>
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(
        `${this.api}/${doc.worker}/doc/${docId}`,
        this.prepareDate(doc)
      )
      .pipe(catchError(this.handleError));
  }

  createDoc(doc: Partial<WorkerDocData>) {
    return this.http
      .post<RestResponse<void | string>>(
        `${this.api}/${doc.worker}/doc`,
        this.prepareDate(doc)
      )
      .pipe(catchError(this.handleError));
  }

  deleteDoc(workerId: number, docId: number) {
    return this.http
      .delete<RestResponse<void | string>>(
        `${this.api}/${workerId}/doc/${docId}`
      )
      .pipe(catchError(this.handleError));
  }

  private prepareDate(doc: Partial<WorkerDocData>): FormData {
    const formData = new FormData();
    if (doc.id) {
      formData.set("id", doc.id.toString());
    }
    formData.set("name", doc.name ?? "");

    if (doc.expirationDate && doc.expire) {
      if (!(doc.expire instanceof Date)) {
        doc.expire = new Date(doc.expire);
      }
      formData.set("expire", doc.expire?.toLocaleDateString() ?? "");
    }
    formData.set("expirationDate", doc.expirationDate?.toString() ?? "false");

    if (doc.file) formData.set("file", doc.file);
    formData.set("worker", doc.worker?.toString() ?? "");
    return formData;
  }
}
