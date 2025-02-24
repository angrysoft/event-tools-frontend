import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { DataListResponse } from "../../models/data-list-response";
import { RestResponse } from "../../models/rest-response";
import { CrudService } from "../../services/crud.service";
import { Car, CarDay, CarDoc, CarDocData, CarSchedule } from "../../models/car";

@Injectable({
  providedIn: "root",
})
export class CarsService extends CrudService<Car> {
  getWorkerCars(
    workerId: number
  ): Observable<RestResponse<DataListResponse<Car>>> {
    return this._get<RestResponse<DataListResponse<Car>>>(
      `${this.api}/driver/${workerId}`
    );
  }

  constructor() {
    super();
    this.api = "/api/admin/cars";
  }

  getDoc(carId: number, docId: number): Observable<RestResponse<CarDoc>> {
    return this._get<RestResponse<CarDoc>>(`${this.api}/doc/${docId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateDoc(
    docId: number,
    doc: Partial<CarDocData>
  ): Observable<RestResponse<void | string>> {
    return this.http
      .put<RestResponse<void | string>>(
        `${this.api}/doc/${docId}`,
        this.prepareDate(doc)
      )
      .pipe(catchError(this.handleError));
  }

  createDoc(doc: Partial<CarDocData>) {
    return this.http
      .post<RestResponse<void | string>>(
        `${this.api}/${doc.car}/doc`,
        this.prepareDate(doc)
      )
      .pipe(catchError(this.handleError));
  }

  deleteDoc(docId: number) {
    return this.http
      .delete<RestResponse<void | string>>(`${this.api}/doc/${docId}`)
      .pipe(catchError(this.handleError));
  }

  private prepareDate(doc: Partial<CarDocData>): FormData {
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
    formData.set("car", doc.car?.toString() ?? "");
    return formData;
  }

  getSchedule(
    size: number,
    page: number,
    date: string
  ): Observable<RestResponse<CarSchedule>> {
    return this._get<RestResponse<CarSchedule>>(`/api/cars/schedule`, {
      pageSize: size,
      pageNumber: page,
      date: date,
    });
  }

  getCarDay(carDayId: number) {
    return this._get<RestResponse<CarDay>>(`${this.api}/day/${carDayId}`);
  }

  addCarDay(payload: CarDay) {
    return this._post<CarDay>(`${this.api}/day`, payload);
  }

  updateCarDay(payload: CarDay) {
    return this._put<CarDay>(`${this.api}/day`, payload);
  }

  duplicateCarDay(payload: { from: string; to: string; day: number | null }) {
    return this._put<{ from: string; to: string; day: number | null }>(
      `${this.api}/day/duplicate`,
      payload
    );
  }

  removeDay(day: number) {
    return this._delete(`${this.api}/day/${day}`);
  }

  removeDayList(days: number[]) {
    console.log(days);
    return this._put<number[]>(`${this.api}/day/remove-day-list`, days);
  }
}
