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
import { MatOptionModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { AddonForm, AddonType } from "../../../models/addon";
import { Rate } from "../../../models/rate";
import { AddonsService } from "../../../services/addons.service";

@Component({
  selector: "app-addon-form",
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
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./addon-form.component.html",
  styleUrl: "./addon-form.component.scss",
})
export class AddonFormComponent implements OnInit, OnDestroy {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  service: AddonsService;
  addonForm: FormGroup<AddonForm>;
  addonId = signal<number>(-1);
  formTitle = "Dodatek";
  addonTypes = signal<AddonType[]>([]);
  readonly route = inject(ActivatedRoute);
  private readonly destroy = new Subject();

  constructor() {
    this.service = new AddonsService();

    this.service.getAddonsTypes().subscribe((resp) => {
      if (resp.ok) {
        this.addonTypes.set(resp.data.items);
      }
    });

    const paramRateId = this.route.snapshot.paramMap.get("id");
    if (paramRateId) {
      this.update.set(true);
      this.addonId.set(Number(paramRateId));
    }

    this.addonForm = new FormGroup<AddonForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      addonType: new FormControl("", [Validators.required]),
    });

    effect(() => {
      if (this.addonId() >= 0) {
        this.service.get(this.addonId()).subscribe((resp) => {
          if (resp.ok) {
            this.addonForm.patchValue(resp.data);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.addonForm.events
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        if (formEvents instanceof StatusChangeEvent) {
          this.canSend.set(
            formEvents.status === "VALID" && this.addonForm.dirty,
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (this.addonForm.valid) {
      if (this.update()) this.updateRate();
      else this.addRate();
    }
  }

  updateRate() {
    this.service
      .update(this.addonId(), this.addonForm.value as Rate)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl("/admin/settings/addons");
        else this.service.showError(resp);
      });
  }

  addRate() {
    this.service.create(this.addonForm.value as Rate).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl("/admin/settings/addons");
      else this.service.showError(resp);
    });
  }

  deleteRate() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.addonId()) {
        this.service.delete(this.addonId()).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/settings/addons");
          }
        });
      }
    });
  }

  getAddonType() {
    return this.addonTypes()
      .filter((el) => el.name === this.addonForm.controls.addonType.value)
      .at(0)?.value;
  }
}
