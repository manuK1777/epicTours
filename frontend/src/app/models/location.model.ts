export interface Location {
  id?: number;
  name: string;
  category?: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
  // Relations
  contacts?: any[];
  events?: any[];
  artists?: any[];
}