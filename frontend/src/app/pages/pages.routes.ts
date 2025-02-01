import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArtistsComponent } from './artists/artists.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { VenuesComponent } from './venues/venues.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthGuard } from '../guards/auth.guard';
import { EventsComponent } from './events/events.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'artists',
        component: ArtistsComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Artists',
          roles: ['admin', 'manager'],
          urls: [{ title: 'Dashboard', url: '/home' }, { title: 'Artists' }],
        },
      },
      {
        path: 'artist/:id/:slug',
        component: ArtistDetailComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Artist Details',
          roles: ['admin', 'manager', 'user'],
          urls: [{ title: 'Dashboard', url: '/home' }, { title: 'Artist Details' }],
        },
      },
      {
        path: 'venues',
        component: VenuesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Venues',
          roles: ['admin', 'manager'],
          urls: [{ title: 'Dashboard', url: '/home' }, { title: 'Venues' }],
        },
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Events',
          roles: ['admin', 'manager'],
          urls: [{ title: 'Dashboard', url: '/home' }, { title: 'Events' }],
        },
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Calendar',
          roles: ['admin', 'manager'],
          urls: [{ title: 'Dashboard', url: '/home' }, { title: 'Calendar' }],
        },
      },
      // Default route
      {
        path: '',
        redirectTo: 'artists',
        pathMatch: 'full',
      },
    ],
  },
];
