import { Component } from '@angular/core';
import { SettingListComponent } from "../setting-list/setting-list.component";

@Component({
    selector: 'app-teams',
    imports: [SettingListComponent],
    templateUrl: './teams.component.html',
    styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Nazwa", def: "name" },
    { name: "Sortowanie", def: "sort" },
  ];
}
