import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueDialogComponent } from './venue-dialog.component';

describe('VenueDialogComponent', () => {
  let component: VenueDialogComponent;
  let fixture: ComponentFixture<VenueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
