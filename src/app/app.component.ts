import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Event Tools';

  constructor(private matIconRegistry: MatIconRegistry) {}

  ngOnInit(): void {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined")
  }
}
