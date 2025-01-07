import { MediaMatcher } from "@angular/cdk/layout";
import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { CarDocForm } from "../../../../models/car";
import { CarsService } from "../../../services/cars.service";

@Component({
  selector: "app-car-doc-form",
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
  ],
  templateUrl: "./car-doc-form.component.html",
  styleUrl: "./car-doc-form.component.scss",
  providers: [provideNativeDateAdapter()],
})
export class CarDocFormComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly docsService = inject(CarsService);
  docId = signal<number>(-1);
  carId = signal<number>(-1);
  backTo = signal<string>("/admin/settings/cars");
  canSend = signal<boolean>(false);
  dropZoneClasses = signal<string[]>(["drop-zone"]);
  fileInfo = signal<string>("Dodaj plik albo upuść tutaj.");
  update = signal<boolean>(false);
  docForm: FormGroup<CarDocForm>;
  mobileQuery: MediaQueryList;

  constructor() {
    this.docForm = new FormGroup<CarDocForm>({
      id: new FormControl(),
      file: new FormControl(),
      name: new FormControl("", [Validators.required]),
      expire: new FormControl(),
      expirationDate: new FormControl(false),
      car: new FormControl(this.carId(), [Validators.required]),
    });

    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    const paramDocId = this.route.snapshot.paramMap.get("id");
    const paramCarId = this.route.snapshot.paramMap.get("car");
    
    if (paramDocId && paramCarId) {
      this.carId.set(Number(paramCarId));
      this.backTo.set("/admin/settings/cars/" + paramCarId);
      this.docId.set(Number(paramDocId));
      this.update.set(true);
      this.docsService.getDoc(this.carId(), this.docId()).subscribe((resp) => {
        if (resp.ok) {
          this.docForm.patchValue({
            ...resp.data,
            car: resp.data.car,
          });
        }
      });
    }
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.docForm.markAsDirty();
    this.docForm.controls.file.setValue(ev.dataTransfer!.files[0]);
    this.fileInfo.set(ev.dataTransfer!.files[0].name);
    this.dropZoneClasses.set(["drop-zone"]);
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.dropZoneClasses.set(["drop-zone", "drop-zone-on"]);
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.dropZoneClasses.set(["drop-zone"]);
  }

  onFileChange(ev: Event) {
    const file = ev.target as HTMLInputElement;
    console.log(file.files?.item(0));
    if (file.files && file.files?.length > 0) {
      this.docForm.controls.file.setValue(file.files.item(0));
      this.fileInfo.set(file.files.item(0)!.name);
      this.docForm.markAsDirty();
      this.docForm.updateValueAndValidity();
    }
  }

  handleSubmit() {
    if (!this.docForm.valid) {
      return;
    }

    if (this.docForm.controls.expire.value) {
      this.docForm.controls.expirationDate.setValue(true);
    }

    if (this.update()) this.updateDoc();
    else this.createDoc();
  }

  updateDoc() {
    this.docsService
      .updateDoc(this.docId(), this.docForm.value)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=1");
        else this.docsService.showError(resp);
      });
  }

  createDoc() {
    this.docsService.createDoc(this.docForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=1");
      else this.docsService.showError(resp);
    });
  }
}
