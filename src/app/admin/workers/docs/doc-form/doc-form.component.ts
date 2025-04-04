import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import {
  Component,
  effect,
  inject,
  signal
} from "@angular/core";
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
import { map, Observable, shareReplay } from "rxjs";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { WorkerDocForm } from "../../../../models/worker-doc";
import { DocsService } from "../../../services/docs.service";

@Component({
  selector: "app-doc-form",
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: "./doc-form.component.html",
  styleUrl: "./doc-form.component.scss",
})
export class DocFormComponent {
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly docsService = inject(DocsService);
  docId = signal<number>(-1);
  workerId = signal<number>(-1);
  backTo = signal<string>("/admin/workers");
  dropZoneClasses = signal<string[]>(["drop-zone"]);
  fileInfo = signal<string>("Dodaj plik albo upuść tutaj.");
  update = signal<boolean>(false);
  docForm: FormGroup<WorkerDocForm>;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor() {
    const paramDocId = this.route.snapshot.paramMap.get("id");
    if (paramDocId) {
      this.docId.set(Number(paramDocId));
      this.update.set(true);
    }

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.workerId.set(Number(paramWorkerId));
      this.backTo.set(`/admin/workers/${paramWorkerId}?tab=1`);
    }

    this.docForm = new FormGroup({
      id: new FormControl(),
      file: new FormControl(),
      name: new FormControl("", [Validators.required]),
      expire: new FormControl(),
      expirationDate: new FormControl(false),
      worker: new FormControl(this.workerId(), [Validators.required]),
    });

    effect(() => {
      if (this.docId() >= 0 && this.workerId() >= 0) {
        this.docsService
          .getDoc(this.workerId(), this.docId())
          .subscribe((resp) => {
            if (resp.ok) {
              this.docForm.patchValue({
                ...resp.data,
                worker: resp.data.worker?.id,
              });
            }
          });
      }
    });
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
        if (resp.ok) this.router.navigateByUrl(this.backTo());
        else this.docsService.showError(resp);
      });
  }

  createDoc() {
    this.docsService.createDoc(this.docForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo());
      else this.docsService.showError(resp);
    });
  }
}
