import { Component, HostListener, inject, input, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-form-base",
  standalone: true,
  imports: [MatIcon, MatDividerModule, RouterLink, MatButtonModule],
  templateUrl: "./form-base.component.html",
  styleUrl: "./form-base.component.scss",
})
export class FormBaseComponent {
  backTo = input.required<string>();
  formTitle = input.required<string>();
  formIdName = input.required<string>();
  queryParams = input<any>({});

  canSend = input<boolean>(false);
  error = signal<string>("");

  router = inject(Router);

  @HostListener("document:keydown.Escape", ['$event'])
  handleCancel(event: any) {
    this.router.navigateByUrl(this.backTo(), { replaceUrl: true });
  }
}
