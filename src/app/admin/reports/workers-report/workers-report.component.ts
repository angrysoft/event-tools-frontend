import { Component, signal } from '@angular/core';
import { LoaderComponent } from "../../../components/loader/loader.component";
import { MatExpansionModule } from '@angular/material/expansion';
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";

@Component({
  selector: 'app-workers-report',
  imports: [LoaderComponent, MatExpansionModule, ActionToolbarComponent],
  templateUrl: './workers-report.component.html',
  styleUrl: './workers-report.component.scss'
})
export class WorkersReportComponent {
  loading = signal<boolean>(false);
  panelOpenState = signal<boolean>(true);
}
