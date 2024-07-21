import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { WorkersService } from "../../services/workers.service";
import { WorkerDetails } from "../../models/worker-details";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-show-worker",
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: "./show-worker.component.html",
  styleUrl: "./show-worker.component.scss",
})
export class ShowWorkerComponent {
  worker: WorkerDetails = {
    firstName: "",
    lastName: "",
    id: 0,
    phone: "",
    email: "",
    nickname: null,
    color: null,
    username: null,
    teamId: null,
    groupId: null,
    hasAccount: false
  };

  constructor(
    private workerService: WorkersService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const workerId = Number(this.route.snapshot.paramMap.get("id"));
    this.workerService.getWorker(workerId).subscribe((response) => {
      if (response.ok) {
        this.worker = response.data;
      }
    });
  }
}
