import { MediaMatcher } from "@angular/cdk/layout";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnDestroy,
  output,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Subject, debounceTime, takeUntil } from "rxjs";
import { dateToString } from "../../utils/date";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
  selector: "app-date-changer-range",
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDatepickerModule,
  ],
  templateUrl: "./date-changer-range.component.html",
  styleUrl: "./date-changer-range.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class DateChangerRangeComponent implements AfterViewInit, OnDestroy {
  dateFrom: FormGroup<DateForm>;
  showRefresh = input<boolean>(false);
  initDate = input<string | null>(null);
  dateChanged = output<{ from: string; to: string }>();
  refresh = output();
  destroy = new Subject();

  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);

    this.dateFrom = new FormGroup<DateForm>({
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    });

    this.dateFrom.statusChanges
      .pipe(debounceTime(500), takeUntil(this.destroy))
      .subscribe((status) => {
        if (status === "VALID") {
          this.dateChanged.emit({
            from: dateToString(this.dateFrom.controls.start.value as Date),
            to: dateToString(this.dateFrom.controls.end.value as Date),
          });
        }
      });
  }

  ngAfterViewInit(): void {
    let from = new Date();
    from.setDate(1);
    const dateString = this.initDate() ?? "";
    if (dateString.length == 10) from = new Date(dateString);
    const to = new Date(from);
    to.setMonth(from.getMonth() + 1);
    to.setDate(to.getDate() - 1);

    this.dateFrom.setValue(
      {
        start: from,
        end: to,
      },
      { emitEvent: false }
    );
    this.dateChanged.emit({ from: dateToString(from), to: dateToString(to) });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }

  nextMonth() {
    this.changeMonth(true);
  }

  prevMonth() {
    this.changeMonth(false);
  }

  changeMonth(add: boolean) {
    const from = new Date(this.dateFrom.controls.start.value as Date);
    const to = new Date(this.dateFrom.controls.end.value as Date);
    if (add) {
      from?.setMonth(from.getMonth() + 1);
      to?.setMonth(to.getMonth() + 1);
    } else {
      from?.setMonth(from.getMonth() - 1);
      to?.setMonth(to.getMonth() - 1);
    }
    this.dateFrom.patchValue({ start: from, end: to });
  }
}

interface DateForm {
  start: FormControl<Date | null>;
  end: FormControl<Date | null>;
}
