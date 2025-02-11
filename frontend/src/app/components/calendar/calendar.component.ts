import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventService } from 'src/app/services/event.service';
import { Event } from '@shared/models/event.model';
import { EventDialogComponent } from 'src/app/modals/event-dialog/event-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, MaterialModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  events: Event[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay,dayGridYear',
    },
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.eventClickHandler.bind(this),
  };

  constructor(
    private eventService: EventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  handleDateClick(arg: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        mode: 'add',
        selectedDate: arg.dateStr,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'add' && result.event) {
        this.eventService.createEvent(result.event).subscribe({
          next: () => {
            console.log('Event added successfully');
            this.loadEvents();
          },
          error: (err) => {
            console.error('Error adding event:', err);
          },
        });
      }
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        console.log('Events loaded:', this.events);
        this.updateCalendarEvents();
      },
      error: (err) => {
        console.error('Error loading events:', err);
      },
    });
  }

  private updateCalendarEvents(): void {
    this.calendarOptions.events = this.events.map((event) => ({
      title: event.title,
      start: this.convertUTCToLocal(event.start_time),
      end: event.end_time ? this.convertUTCToLocal(event.end_time) : undefined,
      color: event.color,
      extendedProps: { ...event },
    }));
  }

  /**
   * Convert a UTC ISO string to local datetime string (YYYY-MM-DDTHH:mm).
   */
  private convertUTCToLocal(utcDateTime: string): string {
    const utcDate = new Date(utcDateTime); // Parse as UTC
    return utcDate.toISOString().slice(0, 16); // Format for datetime-local input
  }

  eventClickHandler(eventInfo: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        event: {
          ...eventInfo.event.extendedProps, // Use raw data
          start_time: eventInfo.event.extendedProps.start_time, // Raw UTC value
          end_time: eventInfo.event.extendedProps.end_time, // Raw UTC value
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit' && result.event) {
        this.eventService.updateEvent(result.event.id, result.event).subscribe({
          next: () => {
            console.log('Event updated successfully');
            this.loadEvents(); // Refresh events
          },
          error: (err) => {
            console.error('Error updating event:', err);
          },
        });
      } else if (result?.action === 'delete' && result.event) {
        this.eventService.deleteEvent(result.event.id).subscribe({
          next: () => {
            console.log('Event deleted successfully');
            this.loadEvents(); // Refresh events
          },
          error: (err) => {
            console.error('Error deleting event:', err);
          },
        });
      }
    });
  }
}
