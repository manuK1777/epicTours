import { TestBed } from '@angular/core/testing';

import { OpenModalMusCrewService } from './open-modal-mus-crew.service';

describe('OpenModalMusCrewService', () => {
  let service: OpenModalMusCrewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenModalMusCrewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
