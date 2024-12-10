import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkerChooserComponent } from "./worker-chooser.component";
import { WorkerBase } from "../../models/worker";

describe("WorkerChooserComponent", () => {
  let component: WorkerChooserComponent<WorkerBase>;
  let fixture: ComponentFixture<WorkerChooserComponent<WorkerBase>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerChooserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkerChooserComponent<WorkerBase>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
