import { Component, input } from '@angular/core';

@Component({
  selector: 'app-month-report-worker-info',
  imports: [],
  templateUrl: './month-report-worker-info.component.html',
  styleUrl: './month-report-worker-info.component.scss'
})
export class MonthReportWorkerInfoComponent {
  name = input.required<string>();
  reportDate = input.required<string>();
}
