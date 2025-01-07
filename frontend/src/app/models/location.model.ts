import { VenueBooker } from './venueBooker.model';

export interface Location {
  id?: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  pendingGeocode?: boolean;
  venueBooker?: VenueBooker[];
  created_at?: string;
  updated_at?: string;
  // Relations
  events?: any[];
  artists?: any[];
}