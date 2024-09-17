import { Component, inject } from '@angular/core';
import { AddButtonComponent } from '../../../components/add-button/add-button.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-setting-list',
  standalone: true,
  imports: [
    AddButtonComponent,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './setting-list.component.html',
  styleUrl: './setting-list.component.scss'
})
export class SettingListComponent<T> {
  service = inject(CrudService<T>)
}
