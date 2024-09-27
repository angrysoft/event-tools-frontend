import { Component } from '@angular/core';
import { SettingListComponent } from '../setting-list/setting-list.component';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [SettingListComponent],
  templateUrl: './rates.component.html',
  styleUrl: './rates.component.scss'
})
export class RatesComponent {
  tableColumns = [
    { name: "id", def: "id" },
    { name: "Nazwa", def: "name" },
    { name: "Typ", def: "rateType" },
  ];
}
