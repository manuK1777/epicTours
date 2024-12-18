import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../modals/confirmation-dialog/confirmation-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class ManageConfirmationModalService {

  constructor(private dialog: MatDialog) { }
  open(config: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
  }) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: config,
    });
  }
}
