import { Component, inject, signal } from "@angular/core";
import { WorkerFormComponent } from "../../components/worker-form/worker-form.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit-worker",
  standalone: true,
  imports: [WorkerFormComponent],
  templateUrl: "./edit-worker.component.html",
  styleUrl: "./edit-worker.component.scss",
})
export class EditWorkerComponent {
  readonly route = inject(ActivatedRoute);
  workerId = signal<number>(-1);

  constructor() {
    this.workerId.set(Number(this.route.snapshot.paramMap.get("id")));
  }
}
