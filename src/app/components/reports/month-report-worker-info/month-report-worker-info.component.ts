import { Component, input } from '@angular/core';

@Component({
  selector: 'app-month-report-worker-info',
  imports: [],
  templateUrl: './month-report-worker-info.component.html',
  styleUrl: './month-report-worker-info.component.scss'
})
export class MonthReportWorkerInfoComponent {
  name = input.required<string>();
  title = input.required<string>();
  reportDate = input<string | null>();
  fromDate = input<string | null>();
  toDate = input<string | null>();
}
