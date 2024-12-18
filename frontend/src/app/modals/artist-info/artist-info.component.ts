import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module'; 

@Component({
  selector: 'app-artist-info',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.scss'
})
export class ArtistInfoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  displayedColumns: string[] = ['field', 'value'];
  artistDataSource = [
    { field: 'Email', value: this.data.email || 'N/A' },
    { field: 'Phone', value: this.data.phone || 'N/A' },
    { field: 'Web Page', value: this.data.webpage || 'N/A' },
    { field: 'Contact', value: this.data.contact || 'N/A' },
  ];
}
