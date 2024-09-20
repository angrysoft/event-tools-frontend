import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DocsService } from "../../../services/docs.service";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  StatusChangeEvent,
  Validators,
} from "@angular/forms";
import { WorkerDocForm } from "../../../models/worker-doc";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable, map, shareReplay } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-doc-form",
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: "./doc-form.component.html",
  styleUrl: "./doc-form.component.scss",
})
export class DocFormComponent implements OnInit {
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly docsService = inject(DocsService);
  docId = signal<number>(-1);
  workerId = signal<number>(-1);
  update: boolean = false;
  formIdName = "doc-form";
  backTo = signal<string>("/admin/workers");
  canSend = signal<boolean>(false);
  docForm: FormGroup<WorkerDocForm>;
  dropZoneClasses = signal<string[]>(["drop-zone"]);
  private _snackBar = inject(MatSnackBar);
  readonly confirm = inject(MatDialog);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  constructor() {
    const paramDocId = this.route.snapshot.paramMap.get("id");
    if (paramDocId) {
      this.docId.set(Number(paramDocId));
      this.update = true;
    }

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.workerId.set(Number(paramWorkerId));
      this.backTo.set("/admin/workers/" + paramWorkerId);
    }

    this.docForm = new FormGroup({
      id: new FormControl(),
      file: new FormControl(),
      name: new FormControl("", [Validators.required]),
      expire: new FormControl(),
      expirationDate: new FormControl(false),
      workerId: new FormControl(this.workerId(), [Validators.required]),
    });

    effect(() => {
      if (this.docId() >= 0 && this.workerId() >= 0) {
        this.docsService.get(this.docId()).subscribe((resp) => {
          if (resp.ok) {
            this.docForm.patchValue(resp.data);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.docForm.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(formEvents.status === "VALID" && this.docForm.dirty);
      }
    });
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.docForm.markAsDirty();
    this.docForm.controls.file.setValue(ev.dataTransfer!.files[0]);
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

  handleSubmit() {
    console.log(this.docForm.value);
    if (!this.docForm.valid) {
      return;
    }

    if (this.docForm.controls.expire.value) {
      this.docForm.controls.expirationDate.setValue(true);
    }

    if (this.update) this.updateDoc();
    else this.createDoc();
  }

  updateDoc() {
    this.docsService.updateDoc(this.docForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo());
      else this.handleError(resp);
    });
  }

  createDoc() {
    this.docsService.createDoc(this.docForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo());
      else this.handleError(resp);
    });
  }

  deleteDoc() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.docId()) {
        this.docsService.delete(this.docId()).subscribe((resp) => {
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
  //TODO: komponent który słucha zdarzeń i dopala snack bara
}
