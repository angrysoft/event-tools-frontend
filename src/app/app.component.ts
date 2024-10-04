import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "Event Tools";

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
    this.auth.getUser();
  }
}
