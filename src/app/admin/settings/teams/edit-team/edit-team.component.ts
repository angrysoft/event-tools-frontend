import { Component, inject, signal } from "@angular/core";
import { TeamFormComponent } from "../team-form/team-form.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit-team",
  standalone: true,
  imports: [TeamFormComponent],
  templateUrl: "./edit-team.component.html",
  styleUrl: "./edit-team.component.scss",
})
export class EditTeamComponent {
  readonly route = inject(ActivatedRoute);
  teamId = signal<number>(-1);

  constructor() {
    this.teamId.set(Number(this.route.snapshot.paramMap.get("id")));
  }
}
