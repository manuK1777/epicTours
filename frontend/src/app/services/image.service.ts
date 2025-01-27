import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = environment.apiUrl;

  constructor() {}

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it's a relative path starting with /uploads, append it to the API URL
    if (imagePath.startsWith('/uploads')) {
      return `${this.apiUrl}${imagePath}`;
    }

    // If it's just a filename, assume it's in uploads
    return `${this.apiUrl}/uploads/${imagePath}`;
  }
}
