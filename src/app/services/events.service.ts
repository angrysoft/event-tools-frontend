import { Injectable } from "@angular/core";
import { RestResponse } from "../models/rest-response";
import { CrudService } from "./crud.service";
import { EventFile, EventItem, EventItemDto } from "../models/events";

@Injectable({
  providedIn: "root",
})
export class EventsService extends CrudService<EventItem | EventItemDto> {
  constructor() {
    super();
    this.api = "/api/admin/events";
  }

  getInfo(eventId: number) {
    return this._get<RestResponse<EventItemDto>>(`${this.api}/info/${eventId}`);
  }

  getEventFiles(eventId: number) {
    return this._get<RestResponse<EventFile[]>>(`${this.api}/${eventId}/file`);
  }

  deleteFile(eventId: number, fileName: string) {
    return this.http.delete<RestResponse<string>>(
      `${this.api}/${eventId}/file/${fileName}`,
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
}
