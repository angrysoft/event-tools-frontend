import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      console.log("redirect to /");
      this.goToHome();
    }
  }

  submit() {
    this.error = null;
    const username = this.form.get("username");
    const password = this.form.get("password");
    console.log("go to home");
    if (this.form.valid) {
      if (this.auth.login(username?.value, password?.value)) {
        this.goToHome();
      } else {
        this.error = "Niepoprawny login lub hasło";
      }
    }
  }

  goToHome() {
    this.router.navigateByUrl("/");
  }

  @Input() error: string | null | undefined;
}
