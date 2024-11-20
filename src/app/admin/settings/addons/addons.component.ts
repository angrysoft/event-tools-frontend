import { Component } from "@angular/core";
import { SettingListComponent } from "../setting-list/setting-list.component";

@Component({
    selector: "app-addons",
    imports: [SettingListComponent],
    templateUrl: "./addons.component.html",
    styleUrl: "./addons.component.scss"
})
export class AddonsComponent {
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Nazwa", def: "name" },
    { name: "Typ", def: "addonTypeName" },
  ];
}
