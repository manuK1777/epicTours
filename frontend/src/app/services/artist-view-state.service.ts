import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ViewMode = 'list' | 'grid';

@Injectable({
  providedIn: 'root',
})
export class ArtistViewStateService {
  private viewModeSubject = new BehaviorSubject<ViewMode>('grid');
  viewMode$ = this.viewModeSubject.asObservable();

  setViewMode(mode: ViewMode) {
    this.viewModeSubject.next(mode);
  }

  getCurrentViewMode(): ViewMode {
    return this.viewModeSubject.value;
  }
}
