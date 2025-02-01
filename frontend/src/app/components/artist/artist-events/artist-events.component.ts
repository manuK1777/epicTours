import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { ArtistsService } from '../../../services/artists.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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

  displayedColumns: string[] = ['title', 'start_time'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private artistsService: ArtistsService) {}

  ngOnInit() {
    this.loadArtistEvents();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadArtistEvents() {
    if (this.artistId) {
      this.artistsService.getArtistEvents(this.artistId).subscribe({
        next: (events) => {
          this.dataSource.data = events;
          this.dataSource.sort = this.sort;

          // Set up custom filter predicate for better search
          this.dataSource.filterPredicate = (data: any, filter: string) => {
            const searchStr = filter.toLowerCase();
            return (
              data.title.toLowerCase().includes(searchStr) ||
              new Date(data.start_time).toLocaleDateString().toLowerCase().includes(searchStr)
            );
          };
        },
        error: (error) => {
          console.error('Error loading artist events:', error);
        },
      });
    }
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement)?.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
