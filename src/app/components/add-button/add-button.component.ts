import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-add-button",
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule],
  templateUrl: "./add-button.component.html",
  styleUrl: "./add-button.component.scss",
})
export class AddButtonComponent {
  url = input.required<string>();
}
