import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Info } from '../../../models/reports';

@Component({
  selector: 'app-month-report-worker-info',
  imports: [DatePipe],
  templateUrl: './month-report-worker-info.component.html',
  styleUrl: './month-report-worker-info.component.scss'
})
export class MonthReportWorkerInfoComponent {
  info = input.required<Info>();
}
