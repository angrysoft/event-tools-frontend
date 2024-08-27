import { Component } from "@angular/core";
import { WorkerFormComponent } from "../../components/worker-form/worker-form.component";

@Component({
  selector: "app-add-worker",
  standalone: true,
  imports: [WorkerFormComponent],
  templateUrl: "./add-worker.component.html",
  styleUrl: "./add-worker.component.scss",
})
export class AddWorkerComponent {}
