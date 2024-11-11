import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Addon, AddonGroup } from "../../admin/models/addon";
import { SelectionModel } from "@angular/cdk/collections";
import { MatButtonModule } from "@angular/material/button";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-worker-day-addons",
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: "./worker-day-addons.component.html",
  styleUrl: "./worker-day-addons.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerDayAddonsComponent implements AfterViewInit, OnDestroy {
  fb = inject(FormBuilder);
  addons = input.required<Addon[]>();
  workerSelection = input.required<SelectionModel<AbstractControl>>();
  addonGroup: FormGroup<AddonGroup>;
  update = output();
  canAdd = signal<boolean>(true);
  destroy = new Subject();

  constructor() {
    this.addonGroup = this.fb.group<AddonGroup>({
      id: new FormControl(null, Validators.required),
      value: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
    });
  }

  ngAfterViewInit(): void {
    this.workerSelection()
      .changed.pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.updateCanAdd();
      });

    this.addonGroup.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.updateCanAdd();
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  addAddon() {
    const addon = this.addons().find((a) => a.id === this.addonGroup.value.id);
    if (
      !addon ||
      (addon.addonType === "VARIABLE_ADDON" &&
        this.addonGroup.value.value === null)
    )
      return;

    for (const worker of this.workerSelection().selected) {
      const workerDayAddons = worker.get("workerDayAddons") as FormArray;

      if (
        !workerDayAddons ||
        workerDayAddons?.value.find((a: any) => a.addon === addon.id)
      )
        continue;

      const workerAddonGroup = this.fb.group({
        worker: new FormControl(worker.value.worker),
        addon: new FormControl(addon.id, Validators.required),
        value: new FormControl(this.addonGroup.value.value),
        name: new FormControl(addon.name),
      });
      workerDayAddons.push(workerAddonGroup);
    }
    this.update.emit();
    this.addonGroup.reset();
  }

  removeWorkerAddon(worker: any, idx: number) {
    worker.get("workerDayAddons").removeAt(idx);
    this.update.emit();
  }

  addonTypeChange(id: number | null | undefined) {
    if (!id) return;
    const addon = this.addons().find((a) => a.id === id);
    
    if (!addon || addon.addonType === "VARIABLE_ADDON") {
      this.addonGroup.controls.value.enable();

    }
    else this.addonGroup.controls.value.disable();

    this.updateCanAdd();
  }

  updateCanAdd() {
    this.canAdd.set(!this.addonGroup.valid || this.workerSelection().isEmpty());
  }
}
