import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-change-rates",
  standalone: true,
  imports: [],
  templateUrl: "./change-rates.component.html",
  styleUrl: "./change-rates.component.scss",
})
export class ChangeRatesComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  constructor() {
    if (this.router.getCurrentNavigation())
      console.log(this.router.getCurrentNavigation().extras.state);
  }
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.dir(data);
    });
  }
}
