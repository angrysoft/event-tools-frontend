import { Injectable } from "@angular/core";
import { RestResponse } from "../models/rest-response";
import { CrudService } from "./crud.service";
import { EventFile, EventItem, EventItemDto } from "../models/events";

@Injectable({
  providedIn: "root",
})
export class EventsService extends CrudService<EventItem | EventItemDto> {
  userApi = "/api/events";

  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getInfo(eventId: number) {
    return this._get<RestResponse<EventItemDto>>(`${this.api}/info/${eventId}`);
  }

  geEventInfoForWorker(event: number) {
    return this._get<RestResponse<EventItemDto>>(
      `${this.userApi}/info/${event}`
    );
  }

  getEventFiles(eventId: number) {
    return this._get<RestResponse<EventFile[]>>(`${this.api}/${eventId}/file`);
  }

  getEventFilesForWorker(event: number) {
    return this._get<RestResponse<EventFile[]>>(
      `${this.userApi}/${event}/file`
    );
  }

  deleteFile(eventId: number, fileName: string) {
    return this.http.delete<RestResponse<string>>(
      `${this.api}/${eventId}/file/${fileName}`
    );
  }

  sendFile(eventId: number, file: File) {
    const formData = new FormData();
    formData.append("eventId", eventId.toString());
    formData.append("file", file);

    return this.http.post(`${this.api}/${eventId}/file`, formData, {
      reportProgress: true,
      observe: "events",
    });
  }

  getWorkersMails(eventId: number) {
    return this._get<
      RestResponse<{ workers: string[]; accountManager: string }>
    >(`${this.api}/worker-emails/${eventId}`);
  }
}
