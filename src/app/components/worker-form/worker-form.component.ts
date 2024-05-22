import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RouterLink } from "@angular/router";
import { RestResponse } from "../../models/rest-response";

@Component({
  selector: "app-worker-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: "./worker-form.component.html",
  styleUrl: "./worker-form.component.scss",
})
export class WorkerFormComponent implements OnInit {
  workerFrom = this.formBuilder.group({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    phone: new FormControl(""),
    email: new FormControl(""),
    nickname: new FormControl(""),
    color: new FormControl(""),
    hasAppAccount: false,
    user: new FormGroup({
      username: new FormControl(""),
      password: new FormControl(""),
      password2: new FormControl(""),
    }),
  });

  formTitle: string = "Dodaj Pracownika";

  hints = {
    teams: [],
    groups: [],
    authorities : ["Koordynacja", "Technika", "Handel"]
  }
  constructor(private formBuilder: FormBuilder, private http:  HttpClient) {}


  ngOnInit(): void {
    this.http.get<RestResponse<WorkerHints>("/api/workers/hints").subscribe(
      response => 
    )
  }


}
