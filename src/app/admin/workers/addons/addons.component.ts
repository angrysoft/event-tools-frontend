import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AddButtonComponent } from "../../../components/add-button/add-button.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { AddonValueDto } from "../../models/addon";
import { AddonsService } from "../../services/addons.service";
import { provideNativeDateAdapter } from "@angular/material/core";
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";

@Component({
  selector: "app-addons",
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    RouterLink,
    MatButtonModule,
    AddButtonComponent,
    MatIcon,
    MatListModule,
    MatExpansionModule,
  ],
  templateUrl: "./addons.component.html",
  styleUrl: "./addons.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MatExpansionPanel],
})
export class AddonsComponent {
  readonly confirm = inject(MatDialog);
  workerAddons = signal<AddonValueDto[]>([]);
  workerId = input.required<number>();
  service = inject(AddonsService);
  accordion = viewChild.required(MatAccordion);

  ngOnInit(): void {
    this.service.getWorkerAddons(this.workerId()).subscribe((resp) => {
      if (resp.ok) {
        this.workerAddons.set(resp.data.items);
      }
    });
  }

  removeAddonValue(rateValueId: number | null) {
    if (!rateValueId) {
      console.warn("Brakuje addon id");
      return;
    }

    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.service.deleteAddonValue(rateValueId).subscribe((response) => {
          if (response.ok) {
            this.workerAddons.set(
              this.workerAddons().filter((rate) => rate.id !== rateValueId),
            );
          }
        });
      }
    });
  }
}
