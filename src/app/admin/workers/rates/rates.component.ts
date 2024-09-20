import { Component, input } from "@angular/core";

@Component({
  selector: "app-rates",
  standalone: true,
  imports: [],
  templateUrl: "./rates.component.html",
  styleUrl: "./rates.component.scss",
})
export class RatesComponent {
  workerId = input.required<number>();
}
