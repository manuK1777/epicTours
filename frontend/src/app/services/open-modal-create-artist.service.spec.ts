import { TestBed } from '@angular/core/testing';

import { OpenModalCreateArtistService } from './open-modal-create-artist.service';

describe('OpenModalCreateArtistService', () => {
  let service: OpenModalCreateArtistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenModalCreateArtistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
