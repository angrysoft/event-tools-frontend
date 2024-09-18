import { Component } from "@angular/core";
import { GroupFormComponent } from "../group-form/group-form.component";

@Component({
  selector: "app-add-group",
  standalone: true,
  imports: [
    GroupFormComponent
],
  templateUrl: "./add-group.component.html",
  styleUrl: "./add-group.component.scss",
})
export class AddGroupComponent {
  
}
