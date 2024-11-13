import { BreakpointObserver } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Addon, AddonValueForm } from "../../../models/addon";
import { AddonsService } from "../../../services/addons.service";

@Component({
  selector: "app-addon-value-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormBaseComponent,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatInput,
    MatDatepickerModule,
    MatIcon,
    MatButtonModule,
    AsyncPipe,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./addon-value-form.component.html",
  styleUrl: "./addon-value-form.component.scss",
})
export class AddonValueFormComponent implements OnInit, OnDestroy {
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly service = inject(AddonsService);
  addonValueId = signal<number>(-1);
  update = signal<boolean>(false);
  backTo = signal<string>("/admin/workers/");
  canSend = signal<boolean>(false);
  addons = signal<Addon[]>([]);
  addonValueForm: FormGroup<AddonValueForm>;
  private readonly destroy = new Subject();

  constructor() {
    this.addonValueForm = new FormGroup<AddonValueForm>({
      id: new FormControl(null),
      workerId: new FormControl(null, Validators.required),
      addonId: new FormControl(null, Validators.required),
      value: new FormControl(0, Validators.required),
    });

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.addonValueForm.controls.workerId.setValue(Number(paramWorkerId));
      this.backTo.update((back) => back + `${paramWorkerId}`);
    }
    const paramAddonValueId = this.route.snapshot.paramMap.get("addonValueId");
    if (paramAddonValueId) {
      this.addonValueId.set(Number(paramAddonValueId));
      this.service.getAddonValue(this.addonValueId()).subscribe((resp) => {
        if (resp.ok) {
          console.log(resp.data)
          this.addonValueForm.patchValue(resp.data);
          this.update.set(true);
        }
      });
    }

    this.service.getAll().subscribe((resp) => {
      if (resp.ok) {
        this.addons.set(
          resp.data.items.filter((a) => a.addonType !== "VARIABLE_ADDON"),
        );
      }
    });
  }

  ngOnInit(): void {
    this.addonValueForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((changeEvent) => {
        console.log(this.addonValueForm.value)
        this.canSend.set(changeEvent === "VALID" && this.addonValueForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (!this.addonValueForm.valid) {
      return;
    }
    if (this.update()) this.updateAddonValue();
    else this.createAddonValue();
  }

  createAddonValue() {
    this.service
      .createAddonValue(this.addonValueForm.value)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=4");
        else this.service.showError(resp);
      });
  }

  updateAddonValue() {
    if (!this.addonValueId()) {
      return;
    }

    this.service
      .updateAddonValue(this.addonValueId(), this.addonValueForm.value)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=4");
        else this.service.showError(resp);
      });
  }

  getAddonName() {
    return this.addons()
      .filter((el) => el.id === this.addonValueForm.controls.addonId.value)
      .at(0)?.name;
  }
}
