import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { Subject } from "rxjs";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { SendDialogComponent } from "../../../components/send-dialog/send-dialog.component";
import { EventFile } from "../../../models/events";
import { EventsService } from "../../../services/events.service";

@Component({
  selector: "app-event-files",
  imports: [MatListModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: "./event-files.component.html",
  styleUrl: "./event-files.component.scss",
})
export class EventFilesComponent {
  eventId = input.required<number>();
  service = inject(EventsService);
  files = signal<EventFile[]>([]);
  confirm = inject(MatDialog);
  dropZoneClasses = signal<string[]>(["drop-zone"]);
  readonly inputFile = viewChild<ElementRef<HTMLInputElement>>("file");
  private readonly cancel = new Subject();

  constructor() {
    effect(() => {
      const id = this.eventId();
      untracked(() => {
        if (id) {
          this.service.getEventFiles(id).subscribe((resp) => {
            if (resp.ok) this.files.set(resp.data);
          });
        }
      });
    });
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.sendFile(ev.dataTransfer!.files);
    this.dropZoneClasses.set(["drop-zone"]);
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.dropZoneClasses.set(["drop-zone", "drop-zone-on"]);
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.dropZoneClasses.set(["drop-zone"]);
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.sendFile(input.files);
  }

  sendFile(files: FileList | null) {
    if (!files) return;

    const dialogRef = this.confirm.open(SendDialogComponent, {
      data: {
        header: "Przesyłam pliki",
        url: `${this.service.api}/${this.eventId()}/file`,
        files: files,
        eventId: this.eventId().toString(),
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const inputFileElement = this.inputFile()?.nativeElement;
      if (inputFileElement) {
        inputFileElement.value = "";
      }
      if (result === true) {
        this.service.getEventFiles(this.eventId()).subscribe((resp) => {
          if (resp.ok) this.files.set(resp.data);
          else this.service.showError(resp);
        });
      }
    });
  }

  removeFile(fileName: string) {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć plik ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && fileName) {
        this.service.deleteFile(this.eventId(), fileName).subscribe((resp) => {
          if (resp.ok) {
            this.filterFiles(fileName);
          } else this.service.showError(resp);
        });
      }
    });
  }

  private filterFiles(fileName: string) {
    this.files.update((files) => files.filter((f) => f.fileName !== fileName));
  }
}
