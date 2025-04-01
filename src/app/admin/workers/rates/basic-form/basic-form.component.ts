import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { BasicPayForm } from "../../../../models/rate";
import { WorkersService } from "../../../../services/workers.service";

@Component({
  selector: "app-basic-form",
  imports: [
    ReactiveFormsModule,
    FormBaseComponent,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: "./basic-form.component.html",
  styleUrl: "./basic-form.component.scss",
})
export class BasicFormComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkersService);
  canSend = signal<boolean>(false);
  backTo = signal<string>("/admin/workers/");
  basicForm: FormGroup<BasicPayForm>;
  destroy = new Subject();
  workerId: number = 0;

  constructor() {
    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.workerId = Number(paramWorkerId);
      this.backTo.set(`/admin/workers/${paramWorkerId}?tab=3`);
    }

    const value = Number(this.route.snapshot.queryParamMap.get("value") ?? "0");

    this.basicForm = new FormGroup<BasicPayForm>({
      value: new FormControl(value, Validators.required),
    });
  }

  ngOnInit(): void {
    this.basicForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((changeEvent) => {
        this.canSend.set(changeEvent === "VALID" && this.basicForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (!this.basicForm.valid) {
      return;
    }
    this.service
      .updateBasicPay(this.workerId, this.basicForm.value)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo());
        else this.service.showError(resp);
      });
  }
}
