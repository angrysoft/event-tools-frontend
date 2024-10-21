import { Component, HostListener, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { EventItemDto } from "../../models/events";
import { EventsService } from "../../services/events.service";

@Component({
  selector: "app-show-event",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    LoaderComponent,
    RouterLink,
  ],
  templateUrl: "./show-event.component.html",
  styleUrl: "./show-event.component.scss",
})
export class ShowEventComponent {
  readonly route = inject(ActivatedRoute);
  readonly confirm = inject(MatDialog);
  readonly router = inject(Router);
  readonly service = inject(EventsService);
  eventData = signal<EventItemDto>({
    id: 0,
    name: "",
    number: "",
    description: "",
    coordinator: "",
    accountManager: "",
    chief: "",
    editors: [],
    color: "",
  });

  loading = signal<boolean>(true);
  eventId: number = Number(this.route.snapshot.paramMap.get("eventId"));
  tabIndex: number = Number(this.route.snapshot.queryParams["tab"] ?? 0);

  constructor() {
    this.service.get(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventData.set(resp.data as EventItemDto);
      }
      this.loading.set(false);
    });
  }

  removeEvent() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Imprezę jest to operacja nieodwracalna" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.eventData().id) {
        this.service.delete(this.eventData().id ?? -1).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/events", { replaceUrl: true });
          } else this.service.showError(response);
        });
      }
    });
  }

  @HostListener("document:keydown.Escape", ["$event"])
  handleCancel(event: any) {
    this.router.navigateByUrl("/admin/events", { replaceUrl: true });
  }
}
