import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: "app-menu-action",
    imports: [
        MatIconModule,
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatListModule,
    ],
    templateUrl: "./menu-action.component.html",
    styleUrl: "./menu-action.component.scss"
})
export class MenuActionComponent {
  readonly href = input<string>("");

  readonly icon = input<string>("");
}
