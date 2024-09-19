import { Component, effect, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DocsService } from "../../../../services/docs.service";

@Component({
  selector: "app-doc-form",
  standalone: true,
  imports: [],
  templateUrl: "./doc-form.component.html",
  styleUrl: "./doc-form.component.scss",
})
export class DocFormComponent {
  readonly route = inject(ActivatedRoute);
  readonly docsService = inject(DocsService);
  docId = signal<number>(-1);
  update: boolean = false;

  constructor() {
    const param = this.route.snapshot.paramMap.get("id");
    if (param) {
      this.docId.set(Number(this.route.snapshot.paramMap.get("id")));
      this.update = true
    }
    effect(() => {
      if (this.docId() >= 0) {

      }
    })
  }
}
