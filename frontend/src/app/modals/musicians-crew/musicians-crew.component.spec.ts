import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiciansCrewComponent } from './musicians-crew.component';

describe('MusiciansCrewComponent', () => {
  let component: MusiciansCrewComponent;
  let fixture: ComponentFixture<MusiciansCrewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusiciansCrewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusiciansCrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
