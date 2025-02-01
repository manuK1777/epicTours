import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ArtistsService } from '../../services/artists.service';
import { Artist } from '@shared/models/artist.model';
import { ArtistListComponent } from '@components/artist/artist-list/artist-list.component';
import { ArtistCardComponent } from '@components/artist/artist-card/artist-card.component';
import { Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { OpenModalCreateArtistService } from '../../services/open-modal-create-artist.service';
import { ArtistViewStateService, ViewMode } from '../../services/artist-view-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ArtistListComponent,
    ArtistCardComponent,
    MatButtonToggleModule,
    FormsModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <mat-button-toggle-group
          [(ngModel)]="currentView"
          (ngModelChange)="onViewChange($event)"
          class="view-toggle"
        >
          <mat-button-toggle value="grid">
            <mat-icon>grid_view</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="list">
            <mat-icon>list</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
        <button mat-raised-button color="primary" (click)="openCreateArtistModal()">
          <mat-icon>add</mat-icon>
          Create Artist
        </button>
      </div>

      <ng-container *ngIf="artists$ | async as artists">
        <app-artist-list
          *ngIf="currentView === 'list'"
          [artists]="artists"
          (artistSelected)="onArtistSelected($event)"
          (createArtist)="openCreateArtistModal()"
        >
        </app-artist-list>

        <app-artist-card
          *ngIf="currentView === 'grid'"
          [artists]="artists"
          (artistSelected)="onArtistSelected($event)"
        >
        </app-artist-card>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .view-toggle {
        margin-right: 20px;
      }
    `,
  ],
})
export class ArtistsComponent implements OnInit, OnDestroy {
  currentView: ViewMode;
  artists$ = this.artistsService.getArtists();
  private destroy$ = new Subject<void>();

  constructor(
    private artistsService: ArtistsService,
    private router: Router,
    private openModalCreateArtistService: OpenModalCreateArtistService,
    private viewStateService: ArtistViewStateService
  ) {
    this.currentView = this.viewStateService.getCurrentViewMode();
  }

  ngOnInit(): void {
    // Subscribe to view mode changes
    this.viewStateService.viewMode$.pipe(takeUntil(this.destroy$)).subscribe((mode) => {
      this.currentView = mode;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onViewChange(mode: ViewMode): void {
    this.viewStateService.setViewMode(mode);
  }

  onArtistSelected(artist: Artist): void {
    const artistSlug = artist.name.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/home/artist', artist.id, artistSlug]);
  }

  openCreateArtistModal(): void {
    const dialogRef = this.openModalCreateArtistService.openCreateArtistModal();

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        // Refresh the artists list
        this.artists$ = this.artistsService.getArtists();
      }
    });
  }
}
