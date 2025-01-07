import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-progress-snackbar',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="progress-container">
      <mat-spinner diameter="20"></mat-spinner>
      <span class="message">{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .progress-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .message {
      margin-left: 8px;
    }
  `]
})
export class ProgressSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
