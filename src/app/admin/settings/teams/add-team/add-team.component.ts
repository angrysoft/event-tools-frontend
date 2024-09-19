import { Component } from '@angular/core';
import { TeamFormComponent } from "../team-form/team-form.component";

@Component({
  selector: 'app-add-team',
  standalone: true,
  imports: [TeamFormComponent],
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss'
})
export class AddTeamComponent {

}
