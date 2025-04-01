import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkersService } from "../../../../services/workers.service";
import { debounceTime, fromEvent, Subject, takeUntil } from "rxjs";
import { AutofocusDirective } from "../../../../directives/autofocus.directive";

@Component({
  selector: "app-worker-desc-form",
  imports: [
    FormBaseComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    AutofocusDirective,
  ],
  templateUrl: "./worker-desc-form.component.html",
  styleUrl: "./worker-desc-form.component.scss",
})
export class WorkerDescFormComponent implements AfterViewInit, OnDestroy {
  descForm: FormGroup<DescForm>;
  backTo = signal<string>("/admin/workers");
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkersService);
  readonly editor = viewChild.required<ElementRef>("editor");
  destroy = new Subject();

  constructor() {
    this.descForm = new FormGroup<DescForm>({
      workers: new FormControl(null, Validators.required),
      desc: new FormControl(null, Validators.required),
    });

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      const workerId = Number(paramWorkerId);
      this.descForm.controls.workers.setValue(workerId);
      this.service.getDesc(workerId).subscribe((resp) => {
        if (resp.ok) {
          if (resp.data) {
            this.descForm.patchValue(resp.data);
            this.editor().nativeElement.innerHTML = resp.data.desc;
          }
        } else this.service.showError(resp);
      });
      this.backTo.set(`/admin/workers/${paramWorkerId}?tab=5`);
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.editor().nativeElement, "input")
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe(() => {
        this.descForm.controls.desc.setValue(
          this.editor().nativeElement.innerHTML
        );
        this.descForm.controls.desc.markAsDirty();
        this.descForm.controls.desc.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (this.descForm.valid) {
      const formValue = this.descForm.value as {
        workers: number;
        desc: string;
      };
      this.service.saveDesc(formValue).subscribe((resp) => {
        if (resp.ok) {
          this.router.navigateByUrl(this.backTo());
        }
      });
    }
  }
}
interface DescForm {
  workers: FormControl<number | null>;
  desc: FormControl<string | null>;
}
