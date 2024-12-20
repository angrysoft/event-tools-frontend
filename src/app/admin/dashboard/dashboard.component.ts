import { Component } from '@angular/core';
import { ExpiredDocsComponent } from "./expired-docs/expired-docs.component";
import { DayOffToAcceptComponent } from "./day-off-to-accept/day-off-to-accept.component";

@Component({
    selector: 'app-dashboard',
    imports: [ExpiredDocsComponent, DayOffToAcceptComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
