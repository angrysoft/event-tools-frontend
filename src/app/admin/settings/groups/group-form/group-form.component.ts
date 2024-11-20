import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal
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
import { Subject, takeUntil } from "rxjs";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { CrudService } from "../../../../services/crud.service";
import { Group, GroupForm } from "../../../models/group";

@Component({
    selector: "app-group-form",
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
    styleUrl: "./group-form.component.scss"
})
export class GroupFormComponent implements OnInit, OnDestroy {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly confirm = inject(MatDialog);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  service: CrudService<Group>;
  groupForm: FormGroup<GroupForm>;
  groupId = signal<number>(-1);
  formTitle = "Grupa";
  readonly backTo = "/admin/settings/groups";
  private readonly destroy = new Subject();

  constructor() {
    this.service = new CrudService<Group>();
    this.service.api = "/api/admin/workers/groups";
    const paramGroupId = this.route.snapshot.paramMap.get("groupId");
    if (paramGroupId) {
      this.update.set(true);
      this.groupId.set(Number(paramGroupId));
    }

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
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.groupForm.events
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        if (formEvents instanceof StatusChangeEvent) {
          this.canSend.set(
            formEvents.status === "VALID" && this.groupForm.dirty,
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (this.groupForm.valid) {
      if (this.update()) this.updateGroup();
      else this.addGroup();
    }
  }

  updateGroup() {
    this.service
      .update(this.groupId(), this.groupForm.value as Group)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo);
        else this.service.showError(resp);
      });
  }

  addGroup() {
    this.service.create(this.groupForm.value as Group).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo);
      else this.service.showError(resp);
    });
  }

  deleteGroup() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.groupId()) {
        this.service.delete(this.groupId()).subscribe((resp) => {
          if (resp.ok) this.router.navigateByUrl(this.backTo);
          else this.service.showError(resp);
        });
      }
    });
  }
}
