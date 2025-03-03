import { Component } from '@angular/core';
import { ExpiredDocsComponent } from "./expired-docs/expired-docs.component";
import { DayOffToAcceptComponent } from "./day-off-to-accept/day-off-to-accept.component";
import { CarExpiredDocsComponent } from "./car-expired-docs/car-expired-docs.component";
import { DiskSpaceComponent } from "./disk-space/disk-space.component";

@Component({
    selector: 'app-dashboard',
    imports: [ExpiredDocsComponent, DayOffToAcceptComponent, CarExpiredDocsComponent, DiskSpaceComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
