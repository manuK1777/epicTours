import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuesTableComponent } from './venues-table.component';

describe('VenuesTableComponent', () => {
  let component: VenuesTableComponent;
  let fixture: ComponentFixture<VenuesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenuesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VenuesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
