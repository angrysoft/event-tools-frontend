import { Component, effect, inject, input, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  StatusChangeEvent,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { CrudService } from "../../../../services/crud.service";
import { Team, TeamForm } from "../../../models/teams";
import { RestResponse } from "../../../../models/rest-response";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-team-form",
  standalone: true,
  imports: [
    FormBaseComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: "./team-form.component.html",
  styleUrl: "./team-form.component.scss",
})
export class TeamFormComponent {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  update: boolean = false;
  canSend = signal<boolean>(false);
  service: CrudService<Team>;
  teamForm: FormGroup<TeamForm>;
  teamId = input<number>(-1);
  error = signal<string>("");
  formTitle = input<string>("Dodaj Grupę");

  constructor() {
    this.service = new CrudService<Team>();
    this.service.setApi("/api/admin/workers/teams");

    this.teamForm = new FormGroup<TeamForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      sort: new FormControl(1, [Validators.required]),
    });

    effect(() => {
      if (this.teamId() >= 0) {
        this.service.get(this.teamId()).subscribe((resp) => {
          if (resp.ok) {
            this.teamForm.patchValue(resp.data);
            this.update = true;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.teamForm.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(formEvents.status === "VALID" && this.teamForm.dirty);
      }
    });
  }

  handleSubmit() {
    if (this.teamForm.valid) {
      if (this.update) this.updateTeam();
      else this.addTeam();
    }
  }

  updateTeam() {
    this.service.update(this.teamForm.value as Team).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/teams");
      else this.handleError(resp.error);
    });
  }

  addTeam() {
    this.service.create(this.teamForm.value as Team).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/teams");
      else this.handleError(resp.error);
    });
  }

  deleteTeam() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.teamId()) {
        this.service.delete(this.teamId()).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/settings/teams");
          }
        });
      }
    });
  }

  handleError(msg: string | null) {
    this.teamForm.controls.name.setErrors({
      exists: true,
    });
    this.error.set(msg ?? "Coś poszło nie tak...");
  }
}
