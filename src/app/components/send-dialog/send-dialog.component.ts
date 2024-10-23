import { HttpClient, HttpEventType } from "@angular/common/http";
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBar } from "@angular/material/progress-bar";
import { SendStatus } from "./model";
import { catchError, of, Subject, takeUntil, throwError } from "rxjs";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "app-send-dialog",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatProgressBar,
    MatIconModule,
    MatDivider,
  ],
  templateUrl: "./send-dialog.component.html",
  styleUrl: "./send-dialog.component.scss",
})
export class SendDialogComponent implements AfterContentInit {
  readonly data = inject(MAT_DIALOG_DATA);
  http = inject(HttpClient);
  sending = signal<boolean>(true);
  sendStatuses = signal<SendStatus[]>([]);
  

  ngAfterContentInit(): void {
    for (const file of this.data.files) {
      this.sendFile(file);
    }
  }

  sendFile(file: File) {
    const progress = signal<number>(0);
    const fileSending = signal<boolean>(true);
    const error = signal<string | null>(null);
    const cancel = new Subject();

    this.sendStatuses.update((st) => {
      st.push({
        name: file.name,
        progress: progress,
        sending: fileSending,
        error: error,
        cancel : () => {
          cancel.next(null);
          cancel.complete();
          fileSending.set(false);
          this.checkTotalSendStatus()
          console.log("cancel clicked");
        }
      });
      return st;
    });

    const formData = new FormData();
    formData.append("eventId", this.data.eventId);
    formData.append("file", file);

    this.http
      .post(this.data.url, formData, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        takeUntil(cancel),
        catchError((err) => {
          if (err.status === 413) {
            error.set("Plik jest za duży");
          } else {
            error.set(err.data ?? "Coś poszło nie tak...");
          }
          progress.set(0);
          fileSending.set(false);
          this.checkTotalSendStatus();
          return of(err);
        }),
      )
      .subscribe((httpEvent) => {
        if (httpEvent.type == HttpEventType.UploadProgress) {
          if (httpEvent.total) {
            if (httpEvent.total == httpEvent.loaded) {
              fileSending.set(false);
              progress.set(100);
              this.checkTotalSendStatus();
            }
            progress.set(
              Math.round(100 * (httpEvent.loaded / httpEvent.total)),
            );
          }
        }
        if (httpEvent.type === HttpEventType.Response) {
          fileSending.set(false);
          progress.set(100);
          this.checkTotalSendStatus();
        }
      });
  }

  checkTotalSendStatus() {
    let snd = false;
    const statuses = [...this.sendStatuses()];
    for (const status of statuses) {
      if (status.sending()) snd = true;
    }
    this.sending.set(snd);
  }

  
}
