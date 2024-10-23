import { HttpClient, HttpEventType } from "@angular/common/http";
import { AfterContentInit, Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { catchError, of, Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-send-dialog",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatProgressBar,
    MatIconModule,
    MatDivider,
    MatListModule
  ],
  templateUrl: "./send-dialog.component.html",
  styleUrl: "./send-dialog.component.scss",
})
export class SendDialogComponent implements AfterContentInit {
  readonly data = inject(MAT_DIALOG_DATA);
  http = inject(HttpClient);
  progress = signal<number>(0);
  sending = signal<boolean>(true);
  error = signal<string | null>(null);
  cancel = new Subject();
  fileNames = signal<string[]>([]);

  ngAfterContentInit(): void {
    const formData = new FormData();
    formData.append("eventId", this.data.eventId);
    for (const file of this.data.files) {
      formData.append("files", file);
      this.fileNames.update((l) => {
        l.push(file.name);
        return l;
      });
    }
    this.sendFiles(formData);
  }

  sendFiles(filesFromData: FormData) {
    this.http
      .post(this.data.url, filesFromData, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        takeUntil(this.cancel),
        catchError((err) => {
          if (err.status === 413) {
            this.error.set("Plik jest za duży");
          } else {
            this.error.set(err.data ?? "Coś poszło nie tak...");
          }
          this.progress.set(0);
          this.sending.set(false);
          return of(err);
        }),
      )
      .subscribe((httpEvent) => {
        console.log(httpEvent);
        if (httpEvent.type == HttpEventType.UploadProgress) {
          if (httpEvent.total) {
            if (httpEvent.total == httpEvent.loaded) {
              this.sending.set(false);
              this.progress.set(100);
            }
            this.progress.set(
              Math.round(100 * (httpEvent.loaded / httpEvent.total)),
            );
          }
        }
        if (httpEvent.type === HttpEventType.Response) {
          this.sending.set(false);
          this.progress.set(100);
        }
      });
  }

  cancelSend() {
    this.cancel.next(null);
    this.cancel.complete();
    this.sending.set(false);
    console.log("cancel clicked");
  }
}
