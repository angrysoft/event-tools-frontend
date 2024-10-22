import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from "@angular/core";
import { EventFile } from "../../models/events";
import { MatListModule } from "@angular/material/list";
import { FileSizePipe } from "../../../pipes/file-size.pipe";
import { EventsService } from "../../services/events.service";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-event-files",
  standalone: true,
  imports: [
    MatListModule,
    FileSizePipe,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDivider,
  ],
  templateUrl: "./event-files.component.html",
  styleUrl: "./event-files.component.scss",
})
export class EventFilesComponent {
  eventId = input.required<number>();
  service = inject(EventsService);
  files = signal<EventFile[]>([]);
  confirm = inject(MatDialog);

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

  removeFile(fileName: string) {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Imprezę jest to operacja nieodwracalna" },
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
