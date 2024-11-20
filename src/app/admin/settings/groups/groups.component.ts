import { Component } from '@angular/core';
import { SettingListComponent } from "../setting-list/setting-list.component";

@Component({
    selector: 'app-groups',
    imports: [SettingListComponent],
    templateUrl: './groups.component.html',
    styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Nazwa", def: "name" },
    { name: "Sortowanie", def: "sort" },
  ];
}
