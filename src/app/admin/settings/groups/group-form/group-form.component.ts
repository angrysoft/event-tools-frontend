import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  StatusChangeEvent,
  Validators,
} from "@angular/forms";
import { CrudService } from "../../../../services/crud.service";
import { Group, GroupForm } from "../../../models/group";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-group-form",
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
  templateUrl: "./group-form.component.html",
  styleUrl: "./group-form.component.scss",
})
export class GroupFormComponent implements OnInit {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  update: boolean = false;
  canSend = signal<boolean>(false);
  service: CrudService<Group>;
  groupForm: FormGroup<GroupForm>;
  groupId = input<number>(-1);
  error = signal<string>("");
  formTitle = input<string>("Dodaj Grupę");
  private _snackBar = inject(MatSnackBar);

  constructor() {
    this.service = new CrudService<Group>();
    this.service.api = "/api/admin/workers/groups";

    this.groupForm = new FormGroup<GroupForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      sort: new FormControl(1, [Validators.required]),
    });

    effect(() => {
      if (this.groupId() >= 0) {
        this.service.get(this.groupId()).subscribe((resp) => {
          if (resp.ok) {
            this.groupForm.patchValue(resp.data);
            this.update = true;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.groupForm.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(formEvents.status === "VALID" && this.groupForm.dirty);
      }
    });
  }

  handleSubmit() {
    if (this.groupForm.valid) {
      if (this.update) this.updateGroup();
      else this.addGroup();
    }
  }

  updateGroup() {
    this.service.update(this.groupId(), this.groupForm.value as Group).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/groups");
      else this.handleError(resp);
    });
  }

  addGroup() {
    this.service.create(this.groupForm.value as Group).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/groups");
      else this.handleError(resp);
    });
  }

  deleteGroup() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.groupId()) {
        this.service.delete(this.groupId()).subscribe((resp) => {
          if (resp.ok) this.router.navigateByUrl("/admin/settings/groups");
          else this.handleError(resp);
        });
      }
    });
  }

  handleError(err: any) {
    console.warn(err.error);
    this._snackBar.open(err.data ?? "Coś poszło nie tak...", "Zamknij", {
      verticalPosition: "top",
    });
  }
}
