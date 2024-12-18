import { TestBed } from '@angular/core/testing';

import { ManageConfirmationModalService } from './manage-confirmation-modal.service';

describe('ManageConfirmationModalService', () => {
  let service: ManageConfirmationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageConfirmationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
