import {
  Component,
  effect,
  input,
  OnInit,
  output,
  signal,
  untracked
} from "@angular/core";
import { CalendarDay } from "../../../models/calendar";
import { MenuAction } from "../../../models/menu";
import { CalendarItemComponent } from "../calendar-item/calendar-item.component";

@Component({
  selector: "app-month",
  imports: [CalendarItemComponent],
  templateUrl: "./month.component.html",
  styleUrl: "./month.component.scss",
})
export class MonthComponent implements OnInit {
  weekDayNames = ["PON.", "WT.", "ŚR.", "CZW.", "PT.", "SOB.", "NIEDZ."];
  monthDays = input.required<CalendarDay[]>();
  monthName = input.required<string>();
  index = input.required<number>();
  days = signal<CalendarDay[]>([]);
  action = output<MenuAction>();

  constructor() {
    effect(() => {
      const idx = this.index();
      untracked(() => {
        this.action.emit({ action: "load", data: idx });
      });
    });
  }

  ngOnInit(): void {
    const weekDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    const headDays: CalendarDay[] = [];
    const tailDays: CalendarDay[] = [];
    const dayOffset = weekDays.indexOf(this.monthDays().at(0)?.weekName ?? "");
    let track = -1;
    if (dayOffset < 0) return;
    for (let i = 0; i < dayOffset; i++) {
      headDays.push({
        day: track,
        weekName: "",
        events: [],
      });
      track--;
    }
    headDays.push(...this.monthDays());

    const dayTail = Math.ceil(headDays.length / 7) * 7 - headDays.length;

    for (let i = 0; i < dayTail; i++) {
      tailDays.push({
        day: track,
        weekName: "",
        events: [],
      });
      track--;
    }
    headDays.push(...tailDays);
    this.days.set(headDays);
  }

  handleAction(menuAction: MenuAction) {
    this.action.emit(menuAction);
  }

  getDay(idx: number) {
    return this.weekDayNames.at(idx);
  }
}
