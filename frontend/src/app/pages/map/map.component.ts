import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Location } from '@shared/models/location.model';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

declare let L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() venues: Location[] = [];
  @Output() editVenue = new EventEmitter<{ id: number; updatedVenue: Location }>();
  @Output() deleteVenue = new EventEmitter<number>();

  private map: any;
  private markersLayer: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initMap();
    this.updateMapMarkers(this.venues);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venues'] && this.map) {
      this.updateMapMarkers(this.venues);
    }
  }

  private initMap(): void {
    // Initialize the map
    this.map = L.map('map').setView([40, -20], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Create a layer group for markers
    this.markersLayer = L.layerGroup().addTo(this.map);
  }

  private updateMapMarkers(locations: Location[]): void {
    // Clear existing markers from the layer group
    this.markersLayer.clearLayers();

    // Add new markers
    locations.forEach((location) => {
      const marker = L.marker([+location.latitude, +location.longitude]);
      marker.bindPopup(`
        <b>${location.name}</b><br>
        ${location.category || 'No Category'}<br>
        <a href="https://example.com/location/${location.id}" target="_blank">More details</a>
      `);
      this.markersLayer.addLayer(marker);
    });
  }

  onEditVenue(id: number, updatedVenue: Location): void {
    this.editVenue.emit({ id, updatedVenue });
  }

  onDelete(id: number): void {
    this.deleteVenue.emit(id); // Emit the venue ID for deletion
  }
}
