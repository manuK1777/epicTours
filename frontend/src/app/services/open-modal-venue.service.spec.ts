import { TestBed } from '@angular/core/testing';
import { OpenModalVenueService } from './open-modal-venue.service';
import 'jasmine';

describe('OpenModalVenueService', () => {
  let service: OpenModalVenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenModalVenueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
