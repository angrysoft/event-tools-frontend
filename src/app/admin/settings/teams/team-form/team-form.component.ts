import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  StatusChangeEvent,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { CrudService } from "../../../../services/crud.service";
import { Team, TeamForm } from "../../../../models/teams";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-team-form",
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
export class TeamFormComponent implements OnInit, OnDestroy {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly confirm = inject(MatDialog);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  teamId = signal<number>(-1);
  service: CrudService<Team>;
  teamForm: FormGroup<TeamForm>;
  formTitle = "Grupa";
  readonly backTo = "/admin/settings/teams";

  private readonly destroy = new Subject();

  constructor() {
    this.service = new CrudService<Team>();
    this.service.api = "/api/admin/workers/teams";
    const paramTeamId = this.route.snapshot.paramMap.get("teamId");
    if (paramTeamId) {
      this.update.set(true);
      this.teamId.set(Number(paramTeamId));
    }

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
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.teamForm.events
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        if (formEvents instanceof StatusChangeEvent) {
          this.canSend.set(
            formEvents.status === "VALID" && this.teamForm.dirty
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (this.teamForm.valid) {
      if (this.update()) this.updateTeam();
      else this.addTeam();
    }
  }

  updateTeam() {
    this.service
      .update(this.teamId(), this.teamForm.value as Team)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo);
        else this.service.showError(resp);
      });
  }

  addTeam() {
    this.service.create(this.teamForm.value as Team).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo);
      else this.service.showError(resp);
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
            this.router.navigateByUrl(this.backTo);
          } else this.service.showError(response);
        });
      }
    });
  }
}
