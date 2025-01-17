import { Routes } from '@angular/router';
import { homeComponent } from './home/home.component';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { MapComponent } from './map/map.component';
import { VenuesComponent } from './venues/venues.component';
import { CalendarComponent } from './calendar/calendar.component';
import { VenuesTableComponent } from './venues-table/venues-table.component';
import { ChartsComponent } from './charts/charts.component';
import { ChartBarComponent } from './chart-bar/chart-bar.component';
import { ChartLineComponent } from './chart-line/chart-line.component';
import { AuthGuard } from '../guards/auth.guard';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: homeComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['admin', 'manager', 'user']
    }
  },
  {
    path: 'artist-list', 
    component: ArtistListComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Artist List',
      roles: ['admin', 'manager'],
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Artist List' },
      ],
    },
  },
  {
    path: 'venues',
    component: VenuesComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Venues',
      roles: ['admin', 'manager'],
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Venues' },
      ],
    },
    children: [
      {
        path: 'map',
        component: MapComponent,
        data: {
          title: 'Map View',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'table',
        component: VenuesTableComponent,
        data: {
          title: 'Table View',
          roles: ['admin', 'manager']
        }
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'calendar', 
    component: CalendarComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Calendar',
      roles: ['admin', 'manager'],
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Calendar' },
      ],
    },
  },
  {
    path: 'charts', 
    component: ChartsComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Charts',
      roles: ['admin'],
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Charts' },
      ],
    },
    children: [
      {
        path: 'bar',
        component: ChartBarComponent,
        data: {
          title: 'Bar Charts',
          roles: ['admin']
        }
      },
      {
        path: 'line',
        component: ChartLineComponent, 
        data: {
          title: 'Line Charts',
          roles: ['admin']
        }
      },
      {
        path: '',
        redirectTo: 'charts',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'artist/:id/:slug', 
    component: ArtistDetailComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Artist Details',
      roles: ['admin', 'manager', 'user'],
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Artist Details' },
      ],
    },
  },
];
