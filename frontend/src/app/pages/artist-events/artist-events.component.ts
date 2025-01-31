import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ArtistsService } from '../../services/artists.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-artist-events',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './artist-events.component.html',
  styleUrls: ['./artist-events.component.scss'],
})
export class ArtistEventsComponent implements OnInit {
  @Input() artistId!: number;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['title', 'start_time'];
  dataSource: MatTableDataSource<Event>;

  constructor(private artistsService: ArtistsService) {
    this.dataSource = new MatTableDataSource<Event>([]);
  }

  ngOnInit() {
    this.loadArtistEvents();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadArtistEvents() {
    if (this.artistId) {
      this.artistsService.getArtistEvents(this.artistId).subscribe({
        next: (events) => {
          this.dataSource.data = events;
        },
        error: (error) => {
          console.error('Error loading artist events:', error);
        },
      });
    }
  }
}
