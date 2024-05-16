import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-menu-action",
  standalone: true,
  imports: [MatIconModule],
  templateUrl: "./menu-action.component.html",
  styleUrl: "./menu-action.component.scss",
})
export class MenuActionComponent {
  @Input()
  href: string = "";

  @Input()
  icon: string = "";
}
