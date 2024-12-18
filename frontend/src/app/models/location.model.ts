export interface Location {
    id?: number;
    name: string;
    category?: string;
    latitude: number;
    longitude: number;
    contact_id?: number; // Foreign key to the contact table
  }
  