import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module'; 
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-artist-info',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.scss']
})
export class ArtistInfoComponent {
  displayedColumns: string[] = ['field', 'value'];
  artistDataSource = [
    { field: 'Email', value: this.data.email || 'N/A' },
    { field: 'Phone', value: this.data.phone || 'N/A' },
    { field: 'Contact', value: this.data.contact || 'N/A' },
    { field: 'Web Page', value: this.sanitizeWebPage(this.data.webpage) || 'N/A' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {}

  sanitizeWebPage(url: string | null): string {
    if (!url || url.trim() === '') {
      return '#';
    }
    return url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
  }
}
