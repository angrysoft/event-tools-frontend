import {
  Component,
  OnInit
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

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
    MatProgressBarModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });

  error: string | null | undefined;

  sending: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.loginError.subscribe((err) => {
      this.error = err;
      this.sending = false;
    });
    
    this.auth.getUser();
  }

  submit() {
    this.error = null;
    const username = this.form.get("username");
    const password = this.form.get("password");
    if (this.form.valid) {
      this.sending = true;
      this.auth.login(username?.value, password?.value);
    }
  }
}
