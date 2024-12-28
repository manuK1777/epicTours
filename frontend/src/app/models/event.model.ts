export interface Event {
  id?: number;
  venue_id?: number;
  title: string;
  category: string;
  start_time: string;
  end_time: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
  // Relations
  venue?: any;
  artists?: any[];
}