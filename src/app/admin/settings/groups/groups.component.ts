import { Component } from '@angular/core';
import { SettingListComponent } from "../setting-list/setting-list.component";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [SettingListComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {

}
