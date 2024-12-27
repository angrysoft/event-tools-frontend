import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { ActionToolbarComponent } from "../action-toolbar/action-toolbar.component";

@Component({
  selector: "app-form-base",
  imports: [MatDividerModule, MatButtonModule, ActionToolbarComponent],
  templateUrl: "./form-base.component.html",
  styleUrl: "./form-base.component.scss",
})
export class FormBaseComponent {
  backTo = input.required<string>();
  formTitle = input.required<string>();
  formIdName = input.required<string>();
  queryParams = input<{ [key: string]: string | number }>({});
  canSend = input<boolean>(false);
}
