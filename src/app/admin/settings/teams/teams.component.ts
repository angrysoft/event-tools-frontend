import { Component } from '@angular/core';
import { SettingListComponent } from "../setting-list/setting-list.component";

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [SettingListComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {

}
