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

export const PagesRoutes: Routes = [
  {
    path: '',
    component: homeComponent,
    // data: {
    //   title: 'Home',
    //   urls: [
    //     { title: 'Dashboard', url: '/home' },
    //     { title: 'Home' },
    //   ],
    // },
  },
  {
    path: 'artist-list', 
    component: ArtistListComponent,
    data: {
      title: 'Artist List',
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Artist List' },
      ],
    },
  },
  {
    path: 'venues',
    component: VenuesComponent, // Parent component
    data: {
      title: 'Venues',
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Venues' },
      ],
    },
    children: [
      {
        path: 'map',
        component: MapComponent, // Map view
        data: {
          title: 'Map View',
          urls: [
            { title: 'Dashboard', url: '/home' },
            { title: 'Venues' },
          ],
        },
        
      },
      {
        path: 'table',
        component: VenuesTableComponent, // Table view
        data: {
          title: 'Table View',
          urls: [
            { title: 'Dashboard', url: '/home' },
            { title: 'Venues' },
          ],
        },
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
    data: {
      title: 'Calendar',
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Calendar' },
      ],
    },
  },
  {
    path: 'charts', 
    component: ChartsComponent,
    data: {
      title: 'Charts',
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Charts' },
      ],
    },
    children: [
      {
        path: 'Bar chart',
        component: ChartBarComponent,
        data: {
          title: 'Bar chart',
        },
      },
      {
        path: 'Line chart',
        component: ChartLineComponent, 
        data: {
          title: 'Line chart',
        },
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
    data: {
      title: 'Artist Details',
      urls: [
        { title: 'Dashboard', url: '/home' },
        { title: 'Artist Details' },
      ],
    },
  },
];


