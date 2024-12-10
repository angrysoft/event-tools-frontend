import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: "app-set-theme",
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
  ],
  templateUrl: "./set-theme.component.html",
  styleUrl: "./set-theme.component.scss",
})
export class SetThemeComponent {
  setThemeFrom: FormGroup<ThemeForm>;

  constructor() {
    const colorScheme: string = localStorage.getItem("theme") ?? "system";

    this.setThemeFrom = new FormGroup<ThemeForm>({
      theme: new FormControl(colorScheme, Validators.required),
    });
  }

  save() {
    const theme = this.setThemeFrom.value.theme;
    if (!theme) return;

    localStorage.setItem("theme", this.setThemeFrom.value.theme ?? "system");
    const r = document.querySelector(":root") as HTMLElement;
    switch (theme) {
      case "system":
        r.style.setProperty("--color-theme", "light dark");
        break;
      case "light":
        r.style.setProperty("--color-theme", "light");
        break;

      case "dark":
        r.style.setProperty("--color-theme", "dark");
        break;
    }
  }
}

interface ThemeForm {
  theme: FormControl<string | null>;
}
