import { TestBed } from '@angular/core/testing';

import { OpenModalArtistInfoService } from './open-modal-artist-info.service';

describe('OpenModalArtistInfoService', () => {
  let service: OpenModalArtistInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenModalArtistInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
