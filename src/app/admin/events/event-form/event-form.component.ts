import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
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
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { FormBaseComponent } from "../../../components/form-base/form-base.component";
import { AddonType } from "../../models/addon";
import { EventForm } from "../../models/events";
import { EventsService } from "../../services/events.service";
import { OfficeWorkers, WorkerBase } from "../../models/worker";
import { WorkerChooserComponent } from "../../../components/worker-chooser/worker-chooser.component";

@Component({
  selector: "app-event-form",
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
    WorkerChooserComponent,
  ],
  templateUrl: "./event-form.component.html",
  styleUrl: "./event-form.component.scss",
})
export class EventFormComponent implements OnInit, OnDestroy {

  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  readonly route = inject(ActivatedRoute);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  eventId = signal<number>(-1);
  officeWorkers = signal<OfficeWorkers>({
    coordinators: [],
    accountManagers: [],
  });
  service: EventsService;
  eventForm: FormGroup<EventForm>;
  formTitle = "Impreza";
  backTo = "/admin/events";
  private readonly destroy = new Subject();
  selectedChief: Set<WorkerBase> = new Set();

  constructor() {
    this.service = new EventsService();

    const paramEventId = this.route.snapshot.paramMap.get("eventId");
    if (paramEventId) {
      this.update.set(true);
      this.eventId.set(Number(paramEventId));
    }

    this.eventForm = new FormGroup<EventForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      number: new FormControl("", [Validators.required]),
      coordinatorId: new FormControl(null, Validators.required),
      accountManagerId: new FormControl(null, Validators.required),
      chiefId: new FormControl(null, Validators.required),
      description: new FormControl(""),
    });

    this.service.getOfficeWorkers().subscribe((resp) => {
      if (resp.ok) {
        this.officeWorkers.set(resp.data);
      }
    });

    effect(() => {
      if (this.eventId() >= 0) {
        this.service.get(this.eventId()).subscribe((resp) => {
          if (resp.ok) {
            // this.eventForm.patchValue(resp.data);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.eventForm.events
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        if (formEvents instanceof StatusChangeEvent) {
          console.log(this.eventForm.value);
          this.canSend.set(
            formEvents.status === "VALID" && this.eventForm.dirty,
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (this.eventForm.valid) {
      if (this.update()) this.updateRate();
      else this.addRate();
    }
  }

  updateRate() {
    this.service
      .update(this.eventId(), this.eventForm.value as Event)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo);
        else this.service.showError(resp);
      });
  }

  addRate() {
    this.service.create(this.eventForm.value as Event).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo);
      else this.service.showError(resp);
    });
  }

  deleteRate() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.eventId()) {
        this.service.delete(this.eventId()).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/settings/addons");
          } else this.service.showError(response);
        });
      }
    });
  }

  onApprove(ev: Set<WorkerBase>) {
    console.log(ev);
  }
}
