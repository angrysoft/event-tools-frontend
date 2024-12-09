import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WorkerDoc } from '../../../models/worker-doc';

@Component({
  selector: "app-worker-docs",
  imports: [MatCardModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: "./worker-docs.component.html",
  styleUrl: "./worker-docs.component.scss",
})
export class WorkerDocsComponent {
  workerDocs = input.required<WorkerDoc[]>();
}
