import { Component } from '@angular/core';
import { ExpiredDocsComponent } from "./expired-docs/expired-docs.component";
import { DayOffToAcceptComponent } from "./day-off-to-accept/day-off-to-accept.component";
import { CarExpiredDocsComponent } from "./car-expired-docs/car-expired-docs.component";

@Component({
    selector: 'app-dashboard',
    imports: [ExpiredDocsComponent, DayOffToAcceptComponent, CarExpiredDocsComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
