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
import { Group, GroupFrom } from "../../../models/group";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";

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
  groupForm: FormGroup<GroupFrom>;
  groupId = input<number>(-1);
  error = signal<string>("");
  formTitle = input<string>("Dodaj Grupę");

  constructor() {
    this.service = new CrudService<Group>();
    this.service.setApi("/api/admin/workers/groups");

    this.groupForm = new FormGroup<GroupFrom>({
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
    this.service.update(this.groupForm.value as Group).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/groups");
      else this.error.set(resp.error ?? "Coś poszło nie tak...");
    });
  }

  addGroup() {
    this.service.create(this.groupForm.value as Group).subscribe((resp) => {
      console.log(resp);
      if (resp.ok) this.router.navigateByUrl("/admin/settings/groups");
      else this.error.set(resp.error ?? "Coś poszło nie tak...");
    });
  }

  deleteGroup() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Grupe jest to operacja nieodwracalna" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.groupId()) {
        this.service.delete(this.groupId()).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/settings/groups");
          }
        });
      }
    });
  }
}
