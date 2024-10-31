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
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EventDay, WorkerDay } from "../../models/events";
import { EventDaysService } from "../../services/event-days.service";
import { AddDayComponent } from "./add-day/add-day.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { DatePipe } from "@angular/common";
import { WorkerDayComponent } from "./worker-day/worker-day.component";
import { dateToString } from "../../../utils/date";
import { SelectionModel } from "@angular/cdk/collections";
import { WorkerDaysService } from "../../services/worker-days.service";

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
  editRatesAndAddons() {
    throw new Error("Method not implemented.");
  }
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(EventDaysService);
  workerDayService = inject(WorkerDaysService);

  eventDays = signal<EventDay[]>([]);
  tabIndex = signal<number>(2);
  name = this.route.snapshot.queryParamMap.get("name");
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  backTo = `/admin/events/${this.eventId}`;
  selection = new SelectionModel<WorkerDay>(true, []);

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
      untracked(() => {
        const tab = this.route.snapshot.queryParamMap.get("tab");
        console.log(tab);
        if (tab) {
          this.tabIndex.set(Number(tab));
        } else {
          this.tabIndex.set(idx);
        }
      });
    });
  }

  tabChange(idx: number) {
    this.selection.clear();
    this.tabIndex.set(idx);
  }

  get isMultipleSelected() {
    // always return true ?!?!
    //this.selection().isMultipleSelection()
    return this.selection.selected.length !== 1;
  }

  addDay() {
    const addDialog = this.dialog.open(AddDayComponent, { disableClose: true });
    addDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log({
        event: this.eventId,
        startDate: dateToString(result.startDate),
        state: "TEMPLATE",
        info: result.info,
        workerDays: [],
      });
      this.service
        .addDay(this.eventId, {
          event: this.eventId,
          startDate: dateToString(result.startDate),
          state: "TEMPLATE",
          info: result.info,
          workerDays: [],
        })
        .subscribe((resp) => {
          if (resp.ok) {
            result.id = resp.data;
            this.eventDays.update((d) => {
              d.push(result);
              return d.sort((s, e) => {
                if (s.startDate == e.startDate) return 0;
                if (s.startDate > e.startDate) return 1;
                else return -1;
              });
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

  addWorkers() {
    const dayId = this.eventDays().at(this.tabIndex())?.id ?? -1;
    this.router.navigateByUrl(
      `/admin/events/${this.eventId}/day/${dayId}?tab=${this.tabIndex()}`,
    );
  }

  duplicateDay() {
    const dayId = this.eventDays().at(this.tabIndex())?.id ?? -1;
    console.log(dayId);
  }

  editTime() {}

  removeWorkers() {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.workerDayService.removeWorkersDays(
          this.eventId,
          this.selection.selected
            .map((w) => w.id)
            .filter((w) => typeof w === "number"),
        );
      }
    });
  }

  changeWorker() {}

  @HostListener("document:keydown.Alt.a", ["$event"])
  handleAdd() {
    this.addDay();
  }
}
