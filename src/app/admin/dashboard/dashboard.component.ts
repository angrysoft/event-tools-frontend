import { Component } from '@angular/core';
import { ExpiredDocsComponent } from "./expired-docs/expired-docs.component";

@Component({
    selector: 'app-dashboard',
    imports: [ExpiredDocsComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
