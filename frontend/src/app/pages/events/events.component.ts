import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import { Event } from '@shared/models/event.model';
import { EventDialogComponent } from 'src/app/modals/event-dialog/event-dialog.component';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  selected: Date | null = null;
  events: Event[] = [];

  constructor(
    private eventService: EventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  onDateSelected(date: Date): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        mode: 'add',
        selectedDate: date.toISOString().split('T')[0],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'add' && result.event) {
        this.eventService.createEvent(result.event).subscribe(() => {
          this.loadEvents();
        });
      } else if (result?.action === 'edit' && result.event) {
        this.eventService.updateEvent(result.event.id, result.event).subscribe(() => {
          this.loadEvents();
        });
      } else if (result?.action === 'delete' && result.event) {
        this.eventService.deleteEvent(result.event.id).subscribe(() => {
          this.loadEvents();
        });
      }
    });
  }

  dateClass = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return this.events.some((event) => event.start_time.split('T')[0] === dateString)
      ? 'event-date'
      : '';
  };
}
