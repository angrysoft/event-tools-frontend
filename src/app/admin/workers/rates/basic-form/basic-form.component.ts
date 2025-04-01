import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
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
export class BasicFormComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkersService);
  canSend = signal<boolean>(false);
  backTo = signal<string>("/admin/workers/");
  basicForm: FormGroup<BasicPayForm>;
  workerId: number = 0;

  constructor() {
    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.workerId = Number(paramWorkerId);
      this.backTo.set(`/admin/workers/${paramWorkerId}?tab=3`);
    }

    const value = Number(this.route.snapshot.queryParamMap.get("value") ?? "0");

    this.basicForm = new FormGroup<BasicPayForm>({
      workers: new FormControl(this.workerId, Validators.required),
      value: new FormControl(value, Validators.required),
    });
  }

  handleSubmit() {
    if (!this.basicForm.valid) {
      return;
    }
    this.service.updateBasicPay(this.basicForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo());
      else this.service.showError(resp);
    });
  }
}
