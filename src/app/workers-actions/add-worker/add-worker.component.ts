import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkerFormComponent } from '../../components/worker-form/worker-form.component';

@Component({
  selector: 'app-add-worker',
  standalone: true,
  imports: [
    
    WorkerFormComponent,
  ],
  templateUrl: './add-worker.component.html',
  styleUrl: './add-worker.component.scss'
})
export class AddWorkerComponent {
  
}
