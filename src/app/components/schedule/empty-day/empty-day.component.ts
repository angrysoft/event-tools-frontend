import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { Component, input, output } from '@angular/core';
import { MenuAction } from '../../../models/menu';

@Component({
  selector: "app-empty-day",
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: "./empty-day.component.html",
  styleUrl: "./empty-day.component.scss",
})
export class EmptyDayComponent {
  showMenu = input<boolean>(false);
  actionTrigger = output<MenuAction>();
  data = input<any>();

  triggerAction(action: string) {
    this.actionTrigger.emit({
      action: action,
      data: this.data(),
    });
  }
}
