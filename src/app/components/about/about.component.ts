import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { backendVersion, frontendVersion } from '../../version'; 

@Component({
  selector: 'app-about',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  backendVersion = backendVersion;
  frontendVersion = frontendVersion;
}
