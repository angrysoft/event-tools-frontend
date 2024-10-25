import {
  Component,
  effect,
  HostListener,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EventDay } from "../../models/events";
import { EventDaysService } from "../../services/event-days.service";
import { AddDayComponent } from "./add-day/add-day.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { DatePipe } from "@angular/common";
import { WorkerDayComponent } from "./worker-day/worker-day.component";

@Component({
  selector: "app-event-days",
  standalone: true,
  imports: [
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatDividerModule,
    RouterLink,
    DatePipe,
    WorkerDayComponent,
  ],
  templateUrl: "./event-days.component.html",
  styleUrl: "./event-days.component.scss",
})
export class EventDaysComponent {
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  service = inject(EventDaysService);
  eventDays = signal<EventDay[]>([]);
  tabIndex = signal<number>(0);
  name = this.route.snapshot.queryParamMap.get("name");
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  backTo = `/admin/events/${this.eventId}`;

  //FIXME: get worker days ;!!!!

  constructor() {
    this.service.getDays(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventDays.set(
          resp.data.map((day) => {
            day.startDate = new Date(day.startDate);
            return day;
          }),
        );
      }
    });

    effect(() => {
      const idx = this.eventDays().length;
      untracked(() => this.tabIndex.set(idx));
    });
  }

  addDay() {
    const addDialog = this.dialog.open(AddDayComponent, { disableClose: true });
    addDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.service
        .addDay(this.eventId, {
          event: this.eventId,
          startDate: result.startDate,
          state: "TEMPLATE",
          info: result.info,
          workerDays: [],
        })
        .subscribe((resp) => {
          if (resp.ok) {
            this.eventDays.update((d) => {
              d.push(result);
              return d;
            });
          }
        });
    });
  }

  delDay() {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: "Czy jesteś pewien że chcesz usunąć jest to operacja nie odwracalna ?",
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === true) {
        const dayId = this.eventDays().at(this.tabIndex())?.id ?? -1;
        this.service.delDay(this.eventId, dayId).subscribe((resp) => {
          if (resp.ok) {
            this.eventDays.update((days) => days.filter((d) => d.id !== dayId));
          }
        });
      }
    });
  }

  duplicateDay() {
    const dayId = this.eventDays().at(this.tabIndex())?.id ?? -1;
    console.log(dayId);
  }

  @HostListener("document:keydown.Alt.a", ["$event"])
  handleAdd() {
    this.addDay();
  }
}
