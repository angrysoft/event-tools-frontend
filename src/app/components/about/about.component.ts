import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { frontendVersion } from '../../version'; 
import { UtilsService } from '../../services/utils.service';
@Component({
  selector: 'app-about',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  service = inject(UtilsService);
  backendVersion = "";
  frontendVersion = frontendVersion;
  constructor() {
    this.service.getVersions().subscribe((response) => {
      this.backendVersion = response.data;
    });
  }
}
