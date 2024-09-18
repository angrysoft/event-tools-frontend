import { Component, inject, signal } from '@angular/core';
import { GroupFormComponent } from "../group-form/group-form.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [GroupFormComponent],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss'
})
export class EditGroupComponent {
  readonly route = inject(ActivatedRoute);
  groupId = signal<number>(-1);

  constructor() {
    this.groupId.set(Number(this.route.snapshot.paramMap.get("id")));
  }
}
