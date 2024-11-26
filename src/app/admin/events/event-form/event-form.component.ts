import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  untracked,
  viewChild
} from "@angular/core";
import {
  FormArray,
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
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, fromEvent, Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../components/form-base/form-base.component";
import { WorkerChooserConfig } from "../../../components/worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../../../components/worker-chooser/worker-chooser.component";
import { EventItem, EventItemForm } from "../../../models/events";
import { EventsService } from "../../../services/events.service";
import { OfficeWorkers, WorkerBase } from "../../models/worker";
import { WorkersService } from "../../services/workers.service";

@Component({
  selector: "app-event-form",
  imports: [
    FormBaseComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./event-form.component.html",
  styleUrl: "./event-form.component.scss",
})
export class EventFormComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly router = inject(Router);
  readonly confirm = inject(MatDialog);
  readonly route = inject(ActivatedRoute);
  readonly service = inject(EventsService);
  readonly workerService = inject(WorkersService);
  update = signal<boolean>(false);
  canSend = signal<boolean>(false);
  eventId = signal<number>(-1);
  officeWorkers = signal<OfficeWorkers>({
    coordinators: [],
    accountManagers: [],
  });
  eventChiefs = signal<WorkerBase[]>([]);
  eventForm: FormGroup<EventItemForm>;
  formTitle = "Impreza";
  backTo = "/admin/events";
  private readonly destroy = new Subject();
  chiefName = signal<string>("");
  readonly editor = viewChild.required<ElementRef>("editor");

  constructor() {
    const paramEventId = this.route.snapshot.paramMap.get("eventId");
    if (paramEventId) {
      this.update.set(true);
      this.eventId.set(Number(paramEventId));
      this.backTo = this.backTo + "/" + paramEventId;
    }

    this.eventForm = new FormGroup<EventItemForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required]),
      number: new FormControl("", [Validators.required]),
      coordinatorId: new FormControl(null, Validators.required),
      accountManagerId: new FormControl(null, Validators.required),
      chiefId: new FormControl(null, Validators.required),
      description: new FormControl(""),
      eventChiefs: new FormArray<any>([]),
    });

    this.workerService.getOfficeWorkers().subscribe((resp) => {
      if (resp.ok) {
        this.officeWorkers.set(resp.data);
      }
    });

    effect(() => {
      const eventId = this.eventId();

      untracked(() => {
        if (eventId >= 0) {
          this.service.get(this.eventId()).subscribe((resp) => {
            if (resp.ok) {
              const data: EventItem = resp.data as EventItem;
              console.log(data);
              this.eventForm.patchValue(data);
              this.editor().nativeElement.innerHTML = data.description;

              this.getChiefs(data);
            }
          });
        }
      });
    });
  }

  private getChiefs(data: EventItem) {
    this.workerService
      .getWorkersNames([...data.eventChiefs, data.chiefId])
      .subscribe((resp) => {
        if (resp.ok) {
          const mainChief = resp.data
            .filter((el) => el.id == data.chiefId)
            .at(0);
          this.eventChiefs.set(
            resp.data.filter((el) => data.eventChiefs.includes(el.id ?? -1)),
          );
          this.chiefName.set(`${mainChief?.firstName} ${mainChief?.lastName}`);
        }
      });
  }

  ngOnInit(): void {
    this.eventForm.events
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        if (formEvents instanceof StatusChangeEvent) {
          this.canSend.set(
            formEvents.status === "VALID" && this.eventForm.dirty,
          );
        }
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.editor().nativeElement, "input")
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe(() => {
        this.eventForm.controls.description.setValue(
          this.editor().nativeElement.innerHTML,
        );
        this.eventForm.controls.description.markAsDirty();
        this.eventForm.controls.description.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  setDescription(text: any) {
    console.log(text);
    this.eventForm.controls.description.setValue(text.data);
  }

  handleSubmit() {
    console.log(this.eventForm.value, this.eventForm.valid);
    if (this.eventForm.valid) {
      if (this.update()) this.updateEvent();
      else this.addEvent();
    }
  }

  updateEvent() {
    this.service
      .update(this.eventId(), this.eventForm.value as EventItem)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo);
        else this.service.showError(resp);
      });
  }

  addEvent() {
    this.service.create(this.eventForm.value as EventItem).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo);
      else this.service.showError(resp);
    });
  }

  chooseChief() {
    const config: WorkerChooserConfig = {
      single: true,
      search: true,
    };

    const dialogRef = this.confirm.open(WorkerChooserComponent, {
      data: config,
    });

    dialogRef.afterClosed().subscribe((result: Array<WorkerBase> | null) => {
      if (result && result.length > 0) {
        const chief = result.at(0);
        this.eventForm.controls.chiefId.setValue(Number(chief?.id));
        this.chiefName.set(chief?.firstName + " " + chief?.lastName);
        this.eventForm.controls.chiefId.markAsDirty();
        this.eventForm.controls.chiefId.updateValueAndValidity();
      }
    });
  }
}
